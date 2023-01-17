const router = require("express").Router();
const User = require("../Models/user");
const {ensureLoggedIn } = require("../Middleware/auth");
const updateUserSchema = require("../Schemas/updateUser.json");
const jsonschema = require("jsonschema");
let BadRequestError = require("../ErrorHandling/expressError");


// Routes prefixed with "users/". AUTH REQUIRED FOR ALL.

// Returns each users username, email, and bio.
router.get("/all", async function (req, res, next){
  try{
    let allUsers = await User.findAllUsers()
    return res.status(200).json({"allUsers": allUsers});
  } catch(e){
    return(e);
  }
});

// Return given user profile/ bio.
router.get("/:username", async function (req, res, next){
  try{
    let userData = await User.findUser(req.params)
    return res.status(200).json({"userData": userData});
  } catch(e){
    return(e);
  }
});

// If authorized/ given user update profile.
router.patch("/:username", async function (req, res, next){
  try{
    console.log("We need to update", req.params.username);

    let validFieldData = jsonschema.validate(req.body, updateUserSchema);

    if(!validFieldData.valid){
      let fieldErrors = validFieldData.errors.map(e => e.stack);
      return BadRequestError(fieldErrors);
    };
    console.log("Yes- valid", validFieldData.valid);

    // passing in the user who needs updating & the fields for updating.
    let userData = await User.updateUserProfile(req.params, req.body)
    return res.status(200).json({"userData": userData});
  } catch(e){
    return(e);
  }
});


module.exports = router;
