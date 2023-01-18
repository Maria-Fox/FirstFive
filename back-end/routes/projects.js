const router = require("express").Router();
const Project = require("../Models/projects");
const {ensureLoggedIn} = require("../Middleware/auth");
const jsonschema = require("jsonschema");
const updateProjectSchema = require("../Schemas/updateProject.json");
const newProjectSchema = require("../Schemas/newProject.json");
const { BadRequestError, UnauthorizedError } = require("../ErrorHandling/expressError");

// all routes are prefixed with "/projects". LOGIN/ AUTH REQUIRED FOR ALL ROUTES.

// Creates a project. Returns project id, owner_username, project_desc, timeframe.
router.post("/new", ensureLoggedIn, async function (req, res, next){
  try {
    let validInputData = jsonschema.validate(req.body, newProjectSchema);

    if(!validInputData.valid){
      let fieldErrors = validInputData.errors.map(e => e.stack);
      return BadRequestError(fieldErrors);
    };

    let projectData = await Project.createProject(req.body);

    return res.status(200).json(projectData);

  } catch (e){
    return next(e);
  };
});

// Returns each project detail including: id, owner_username, name, project_desc, timeframe.
router.get("/all", ensureLoggedIn, async function (req, res, next){
  try{
    let allProjects = await Project.viewAllProjects();
    return res.status(200).json(allProjects);
  } catch(e){
    next(e);
  };
});

// Returns project detail including: id, owner_username, name, project_desc, timeframe.
router.get("/:project_id", ensureLoggedIn, async function (req, res, next){
  try {
    let projectData = await Project.viewSingleProject(req.params);

    return res.status(200).json(projectData);

  } catch (e){
    return next(e);
  };
});


// Allows project owner_username to update to project details.
router.patch("/:project_id", ensureLoggedIn, async function (req, res, next){
  try {

    let projectToUpdate = await Project.viewSingleProject(req.params);

    // Only the project_owner can update the project data.
    if(projectToUpdate.owner_username === res.locals.user.username){
      let validFieldInputs = jsonschema.validate(req.body, updateProjectSchema);

      if(!validFieldInputs.valid){
        let fieldErrors = validFieldInputs.errors.map(e => e.stack);
        return BadRequestError(fieldErrors);
      };

      let reqData = req.body;

      let projectData = await Project.updateProject(req.params, reqData);
  
      return res.status(204).json(projectData);
      
    } else {
      throw new UnauthorizedError();
    };
  } catch (e){
    return next(e);
  };
});


// Allows project owner_username to update to project details.
router.delete("/:project_id", ensureLoggedIn, async function (req, res, next){
  try {

    let projectToDelete = await Project.viewSingleProject(req.params);

    // Only the project_owner can update the project data.
    if(projectToDelete.owner_username === res.locals.user.username){
      console.log("auth user");
      
      let deleteConfirmation = await Project.delete(req.params.project_id, res.locals.user.username);
  
      return res.status(200).json(deleteConfirmation);
    } else {
      throw new UnauthorizedError();
    };
  } catch (e){
    return next(e);
  };
});


module.exports = router;