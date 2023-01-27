let router = require("express").Router();
let Project_Member = require("../Models/projectMember");
const {ensureLoggedIn, ensureAuthUser, ensureProjectOwner, ensureUserProjMatch} = require("../Middleware/auth");
const jsonschema = require("jsonschema");
const ProjectMemberSchema = require("../Schemas/projMember.json");
const {BadRequestError} = require("../ErrorHandling/expressError");

// All routes are prefixed with "/projectmembers." AUTH REQUIRED FOR ALL.

// Add in new Project_Member. ** Accessible by project_owner only.
router.post("/add/:project_id", 
ensureLoggedIn,
ensureProjectOwner, 
async function (req, res, next){
  try{
    let newUserData = {project_id: req.params.project_id, username: req.body.username}
    let validFieldData = jsonschema.validate(newUserData, ProjectMemberSchema);

    if(!validFieldData.valid){
      let fieldErrors = validFieldData.errors.map(e => e.stack);
      throw new BadRequestError(fieldErrors);
    };

    let newMember = await Project_Member.addMember(req.params, req.body);
    return res.status(201).json(newMember);

  } catch(e){
    return next(e)
  };
});


// See all project members. **Accessible by all users who matched with project.**
router.get("/view/all/:project_id", ensureLoggedIn, ensureUserProjMatch,
async function (req, res, next){
  try{

    let allUsersWhoMatched = await Project_Member.viewAllMembers(req.params);
    return res.status(200).json(allUsersWhoMatched);

  } catch(e){
    return next(e)
  };
});


// Delete given username from project members. **Accessible by project_owner ONLY.**
router.delete("/delete/:project_id", ensureLoggedIn, ensureProjectOwner,
async function (req, res, next){
  try{
    // Project id from params. username to delete from body.
    let deletedUser = await Project_Member.deleteMember(req.params, req.body);
    return res.status(200).json({"Successful": "Deleted user"});
  } catch(e){
    return next(e)
  };
});


module.exports = router;