const router = require("express").Router();
const Project = require("../Models/project");
const { ensureLoggedIn, ensureProjectOwner } = require("../Middleware/auth");
const jsonschema = require("jsonschema");
const updateProjectSchema = require("../Schemas/updateProject.json");
const newProjectSchema = require("../Schemas/newProject.json");
const { BadRequestError, UnauthorizedError } = require("../ErrorHandling/expressError");

// all routes are prefixed with "/projects". LOGIN/ AUTH REQUIRED FOR ALL ROUTES.

// Creates a project. Returns project id, owner_username, project_desc, timeframe.
router.post("/add", ensureLoggedIn, async function (req, res, next) {
  try {
    let validInputData = jsonschema.validate(req.body, newProjectSchema);

    if (!validInputData.valid) {
      let fieldErrors = validInputData.errors.map(e => e.stack);
      throw new BadRequestError(fieldErrors);
    };

    let username = res.locals.user.username;
    let projectData = await Project.createProject({ owner_username: username, ...req.body });

    return res.status(200).json(projectData);

  } catch (e) {
    return next(e);
  };
});

// Returns each project detail including: id, owner_username, name, project_desc, timeframe.
router.get("/all", ensureLoggedIn, async function (req, res, next) {
  try {
    let allProjects = await Project.viewAllProjects();
    return res.status(200).json(allProjects);
  } catch (e) {
    next(e);
  };
});

// Returns the projects (ALL) a user has NOT MATCHED WITH**
// Returns project detail including: id, owner_username, name, project_desc, timeframe
router.get("/unmatched", ensureLoggedIn, async function (req, res, next) {
  try {
    let allProjects = await Project.viewNonMatchedProjs(res.locals.user.username);
    return res.status(200).json(allProjects);
  } catch (e) {
    next(e);
  };
});

// Returns a SINGLE project a user has NOT MATCHED WITH** 
// Returns project detail including: id, owner_username, name, project_desc, timeframe
router.get("/carousel", ensureLoggedIn, async function (req, res, next) {
  try {
    let randomProject = await Project.carouselProjects(res.locals.user.username);
    return res.status(200).json(randomProject);
  } catch (e) {
    next(e);
  };
});

// Returns the projects a user has created.
router.get("/created/by/:username", ensureLoggedIn, async function (req, res, next) {
  try {
    let allProjects = await Project.viewCreatedProjsByUser(res.locals.user.username);
    return res.status(200).json(allProjects);
  } catch (e) {
    next(e);
  };
});

// Returns project detail including: id, owner_username, name, project_desc, timeframe.
router.get("/:project_id", ensureLoggedIn, async function (req, res, next) {
  try {
    let projectData = await Project.viewSingleProject(req.params);

    return res.status(200).json(projectData);

  } catch (e) {
    return next(e);
  };
});


// Allows project owner_username to update to project details.
router.patch("/:project_id",
  ensureLoggedIn,
  ensureProjectOwner,
  async function (req, res, next) {
    try {
      let validFieldInputs = jsonschema.validate(req.body, updateProjectSchema);

      if (!validFieldInputs.valid) {
        let fieldErrors = validFieldInputs.errors.map(e => e.stack);
        throw new BadRequestError(fieldErrors);
      };

      let projectData = await Project.updateProject(req.params, req.body);

      return res.status(200).json(projectData);
    } catch (e) {
      return next(e);
    };
  });


// Allows project owner_username to update to project details.
router.delete("/:project_id",
  ensureLoggedIn, ensureProjectOwner,
  async function (req, res, next) {
    try {
      await Project.delete(req.params.project_id, res.locals.user.username);
      return res.status(200).json({ "Successful": "Deleted" });

    } catch (e) {
      return next(e);
    };
  });


module.exports = router;