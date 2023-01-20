const createJWT = require("./Tokens");
const SECRET_KEY = require("../config");
const jwt = require("jsonwebtoken");

let userData = {
  "username" : "testing_token"
};


// come back- giving me verify issue?
describe("Token payload signed and returned.", function (){
  test("Valid token returns payload.", function (userData) {
    // returns signed token 
    let token = createJWT(userData);
    // console.log(token, "*******")
    let payload  = jwt.verify(token, SECRET_KEY);
    console.log(payload)
    // expect(payload).toEqual({"username" : userData.username, "iat" : expect.any(Number)})
  });
});
