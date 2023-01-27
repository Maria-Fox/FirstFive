const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");

// returns signs JWT. Holds username.

function createJWT(user){
  let payload = {
    username: user.username
  };

  return jwt.sign(payload, SECRET_KEY);
};

module.exports = createJWT;

// Token is later added to req header. {Authorization: token}