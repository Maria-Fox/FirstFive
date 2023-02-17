// Includes register and login routes for user authentication.
const User = require("../Models/user");
const express = require("express");
let router = new express.Router();
let registerUserSchema = require("../Schemas/registerUser.json");
let authenticateUserSchema = require("../Schemas/loginUser.json");
const { BadRequestError } = require("../ErrorHandling/expressError");
const jsonschema = require("jsonschema");
const createJWT = require("../HelperFunctions/Tokens");

// All routes are prefixed with "/auth". NO AUTH required.

// takes in username, password, email, bio. Adds data to db returns user.

router.post("/register", async function (req, res, next) {
  try {
    console.log(req.body, "THIS IS BOD")
    let fieldInputs = jsonschema.validate(req.body, registerUserSchema);
    // if input is not valid notify user of errors.
    console.log("#$%#$%#$%", fieldInputs.valid, "@#$@#$@#$@#");
    if (!fieldInputs.valid) {
      // the error stack is harder for a user to understand. Keeping this in mind displaying error w/ requirements for user readability.
      // const inputErrors = fieldInputs.errors.map(e => e.stack);
      throw new BadRequestError("Please ensure all fields are completed and your password is at least 6 characters long.");
    };

    const newUser = await User.register(req.body);
    // using the newUser data we create and sign a JsonWebToken & return this to the front-end to hold in local storage
    const signedJWT = createJWT(newUser);
    return res.status(201).json({ signedJWT });
  } catch (e) {
    return next(e);
  };
});

// Requires username & password. Returns/ signs jsonWebToken for front-end to store in local storage.

router.post("/login", async function (req, res, next) {
  try {
    let fieldInputs = jsonschema.validate(req.body, authenticateUserSchema);

    if (!fieldInputs.valid) {
      let inputErrors = fieldInputs.errors.map(e => e.stack);
      throw new BadRequestError(inputErrors);
    };

    let authUser = await User.authenticateUser(req.body);
    let signedJWT = createJWT(authUser);
    console.log(`Returning ${signedJWT}, as token`)
    return res.status(200).json({ signedJWT });
  } catch (e) {
    return next(e);
  };

});

module.exports = router;