// Includes register and login routes for user authentication.
const User = require("../Models/user");
const express = require("express");
let router = new express.Router();
let registerUserSchema = require("../Schemas/registerUser.json");
let authenticateUserSchema = require("../Schemas/loginUser.json");
const { json, Router } = require("express");
const {BadRequestError} = require("../ErrorHandling/expressError");
const jsonschema = require("jsonschema");


// All routes are prefixed with "/users"

// THIS IS GIVING ME THE FOLLOWING ERR: error: column   of relation "users" does not exist
router.post("/register", async function (req,res, next){
  try {
    let fieldInputs = jsonschema.validate(req.body, registerUserSchema);
    // if input is not valid notify user of errors.
    if(!fieldInputs.valid){
      const inputErrors = fieldInputs.errors.map(e => e.stack);
      throw new BadRequestError(inputErrors);
    };

    const newUser = await User.register(req.body);
    return res.status(201).json({"newAcct": newUser});
  } catch (e) {
    return next(e);
  };
});

router.post("/login", async function (req, res ,next){
  try {
    let fieldInputs = jsonschema.validate(req.body, authenticateUserSchema);

    if(!fieldInputs.valid) {
      let inputErrors = fieldInputs.errors.map(e => e.stack);
      throw new BadRequestError(inputErrors);
    };
    console.log("/login. The username and password are:", req.body)

    let authUser = await User.authenticateUser(req.body);
    return res.status(200).json({"validUser": authUser})
    // 
  } catch (e){
    return next(e);
  }

});






module.exports = router;