const jwt = require("jsonwebtoken");
const {SECRET_KEY} = require("../config");

// returns signs JWT. Holds username.

function createJWTToken(user){
  let payload = {
    username: user.username
  };

  return jwt.sign(payload, SECRET_KEY);
};

module.exports = createJWTToken;