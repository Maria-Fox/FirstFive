const router = require("express").Router();
const User = require("../Models/user");
const { ensureLoggedIn, ensureAuthUser, ensureMutualMatch, authenticateJWT } = require("../Middleware/auth");
const updateUserSchema = require("../Schemas/updateUser.json");
const jsonschema = require("jsonschema");
let { BadRequestError, UnauthorizedError } = require("../ErrorHandling/expressError");
const confirmMutualMatches = require("../HelperFunctions/MutualMatch");

// Routes prefixed with "users/". AUTH REQUIRED FOR ALL.

// Returns each users username, email, and bio.
router.get("/all", ensureLoggedIn,
  async function (req, res, next) {
    try {
      let allUsers = await User.findAllUsers()
      return res.status(200).json({ "allUsers": allUsers });
    } catch (e) {
      return (e);
    }
  });

// Return given user profile/ bio. Returns username and bio.
router.get("/:username", ensureLoggedIn, ensureMutualMatch,
  async function (req, res, next) {
    try {

      // let mutualMatchSuccess = await confirmMutualMatches(req.params.username, res.locals.user.username);
      let userData = await User.findUser(req.params)
      return res.status(200).json({ "userData": userData });
    } catch (e) {
      return next(e);
    }
  });

// Used for users to view their own profile details. Returns username, email. bio.
router.get("/:username/profile/view", ensureLoggedIn, ensureAuthUser,
  async function (req, res, next) {
    try {
      let userData = await User.viewProfileDetails(req.params.username);
      return res.status(200).json({ "userData": userData });
    } catch (e) {
      return next(e);
    }
  });

// If authorized update user details.
router.patch("/:username", ensureLoggedIn, ensureAuthUser,
  async function (req, res, next) {
    try {

      let validFieldData = jsonschema.validate(req.body, updateUserSchema);

      if (!validFieldData.valid) {
        let fieldErrors = validFieldData.errors.map(e => e.stack);
        throw new BadRequestError(fieldErrors);
      };

      // passing in the user who needs updating & the fields for updating.
      let userData = await User.updateUserProfile(req.params, req.body)
      return res.status(200).json({ "userData": userData });
    } catch (e) {
      return next(e);
    }
  });

// If authorized/ delete account.
router.delete("/:username", ensureLoggedIn, ensureAuthUser, async function (req, res, next) {
  try {

    let deletedUser = await User.deleteUser(req.params);
    return res.status(200).json({ "Success": "Deleted user" });
  } catch (e) {
    return next(e);
  }
});


module.exports = router;
