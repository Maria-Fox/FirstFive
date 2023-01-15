const jsonWebToken = require(jsonWebToken);
const secret_key = require("../config");
const UnauthorizedError = require("../ErrorHandling/expressError");


// If a token is provided it verify against secret_key. If valid store on res.local.user. Otherwise, return an unauthorized error using next.

function authenticateJWT(req, res, next){
  try {

    // signed JWT comes in from req.headers. 

    const authHeader = req.headers && req.headers.authorization;

    if(authHeader){
      // use regex to replace "Bearer :token", removing space. Trim.
      const token = authHeader.replace(/^[Bb]earer /, "").trim();

      // verify token was signed w/ db secret_key. 
      let verifiedUser = jsonWebToken.verify(token, secret_key);
      // The res.locals property is an object that contains response local variables scoped to the request and because of this, it is only available to the view(s) rendered during that request/response cycle (if any).
      // stored on res for client to utilize.
    
      res.locals.user = verifiedUser;
    };

    // if there is no auth header wwe move onto the next app route.
    return next();

  } catch(e){
    return next(e);
  };
};

// ensure there is a user scoped to local res.locals.user

function ensureLoggedIn(req, res, next){

  try{
    if(!res.locals.user){
      throw new UnauthorizedError();
    };

    // if property does hold a user move onto next route.
    return next();
  } catch(e){
    return next(e);
  };
};
