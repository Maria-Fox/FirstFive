const router = require("express").Router();
const Match = require("../Models/match");
const {ensureLoggedIn, ensureAuthUser } = require("../Middleware/auth");

// All routes are prefixded with "/matches." AUTH REQUIRED FOR ALl.

// Create new match b/w user & project. Returns match id, username, and project_id.
router.post("/add/:username/:project_id", 
ensureLoggedIn, ensureAuthUser,
async function (req,res, next){
  try{
      let newMatch = await Match.addMatch(req.params);
      return res.status(201).json(newMatch);
  } catch (e){
    return next(e);
  };
});

// See all PROJECT DATA for projects user has matched with.
router.get("/view/:username/all", 
ensureLoggedIn, ensureAuthUser,
async function (req,res, next){
  try{

      let allProjMatches = await Match.viewAllUserMatches(req.params);
      return res.status(200).json(allProjMatches);
  } catch (e){
    return next(e);
  };
});

// should I limit to only those who have matched with project?
// See ALL users who have matched with project.
router.get("/view/:project_id/users", 
ensureLoggedIn, async function (req,res, next){
  try{
      let allUserMatches = await Match.viewProjectUserMatches(req.params);
      return res.status(200).json(allUserMatches);
  } catch (e){
    return next(e);
  };
});


// Remove user from project matches.
router.post("/remove/:username/:project_id", 
ensureLoggedIn, ensureAuthUser,
async function (req,res, next){
  try{
      let removedUser = await Match.unmatchUser(req.params);
      return res.status(200).json({"Removed": "successful"});
  } catch (e){
    return next(e);
  };
});


module.exports = router;