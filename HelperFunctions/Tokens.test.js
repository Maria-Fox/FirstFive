const createJWT = require("./Tokens");
const {SECRET_KEY} = require("../config");
const jwt = require("jsonwebtoken");

const userData = {
  "username" : "testing_token"
};

describe("Token payload signed and returned.", function (){
  test("Valid token returns payload.", function () {
    let token = createJWT(userData);
    let payload  = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({"username" : userData.username, "iat" : expect.any(Number)})
  });
});
