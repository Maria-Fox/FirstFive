let router = require("express").Router();
let Project_Member = require("../Models/projectMember");
const {ensureLoggedIn, ensureAuthUser, ensureProjectOwner, ensureUserProjMatch} = require("../Middleware/auth");


// All routes are prefixed with "/projectmembers." AUTH REQUIRED FOR ALL.

// Add in new Project_Member -only accessibe by project_owner
router.post("/add/:project_id", 
ensureLoggedIn,
ensureProjectOwner, 
async function (req, res, next){
  try{
      // Req.body holds the username to add.
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