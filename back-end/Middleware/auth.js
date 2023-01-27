const jsonWebToken = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");
const {UnauthorizedError} = require("../ErrorHandling/expressError");
const Project = require("../Models/project");
const Match = require("../Models/match");


// If a token is provided it verify against secret_key. If valid store on res.local.user. Otherwise, return an unauthorized error using next.

function authenticateJWT(req, res, next){
  try {
    // signed JWT comes in from req.headers

    const authHeader = req.headers && req.headers.authorization;

    if(authHeader){
      // use regex to replace "Bearer :token", removing space. Trim.
      const token = authHeader.replace(/^[Bb]earer /, "").trim();

      // returns token payload if token was signed w/ db SECRET_KEY.
      let verifiedUser = jsonWebToken.verify(token, SECRET_KEY);
      // The res.locals property is an object that contains response local variables scoped to the request and because of this, it is only available to the view(s) rendered during that request/response cycle (if any).

      // EX: stores token payload {username: "exampleUser"} on res for client to utilize.
      res.locals.user = verifiedUser;
      console.log("we have res.locals.user", res.locals.user)
    };
    // move onto next route after completing above.
    return next();
  } catch(e){
    // specfically not passing e in. If there is no authHeader simply move onto the nex route.
    return next();
  };
};

// ensure there is a user scoped to local res.locals.user
function ensureLoggedIn(req, res, next){

  try{
    if(!res.locals.user){
      throw new UnauthorizedError();
    };

    // if res.locals property does hold a user move onto next route.
    return next();
  } catch(e){
    return next(e);
  };
};

// Used for editing profile details or updating match preferences.
function ensureAuthUser(req, res, next){
  try{
    if(res.locals.user.username == req.params.username){
      return next();
    } else {
      throw new UnauthorizedError();
    };
  } catch(e){
    return next(e);
  };
};

async function ensureProjectOwner(req, res, next) {
  try {
    // project_id comes in as req param
    let projectData = await Project.viewSingleProject(req.params);
    // console.log("from request ***", projectData)

    if(projectData.owner_username === res.locals.user.username){
      console.log("CONFIRMED PROJ OWNER****")
      return next();
    } else {
      throw new UnauthorizedError();
    };
  } catch(e){
    return next(e);
  };
};

// ensure user matched with project
async function ensureUserProjMatch(req, res, next){
  try{
    // the user is always stored, project_id comes in as parameter.
    let userMatches = await Match.confirmUserMatched(res.locals.user.username, req.params.project_id);

    if(userMatches){
      console.log("MATCHED**********")
      console.log(userMatches)
      return next();
    } else {
      throw new UnauthorizedError();
    }
  }catch(e){
    next(e);
  };
};


module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureAuthUser,
  ensureProjectOwner,
  ensureUserProjMatch
};