const router = require("express").Router();
const Project = require("../Models/projects");
const {ensureLoggedIn} = require("../Middleware/auth");

// all routes are prefixed with "/projects". LOGIN/ AUTH REQUIRED FOR ALL ROUTES.

// Returns each project detail including: id, owner_username, name, project_desc, timeframe.
router.get("/all", ensureLoggedIn, async function (req, res, next){
  try{
    let allProjects = await Project.viewAllProjects();
    return res.status(200).json(allProjects);
  } catch(e){
    next(e);
  }
});

module.exports = router;