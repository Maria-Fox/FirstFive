const app = require("../app");
const request = require("supertest");
const db = require("../db");
const User = require("../Models/user");
const createJWT = require("../HelperFunctions/Tokens");

const {commonnBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  afterAllEnd,
} = require("./forAllTests");

// Using the jest testing functions pass in the steps needed to open/close serv.
beforeAll(commonnBeforeAll); // add in test data
beforeEach(commonBeforeEach); //start db 
afterEach(commonAfterEach); // rollback the previous changes
afterAll(afterAllEnd); //close connection to db

// 
let authToken = createJWT({user: {username: "newUser"}});
console.log(authToken);

// All routes are prefixed with auth/
describe("POST /register", function () {
  test("Register new user successfully", async function (){
    let newUserData = {
      "username": "newTestUser",
      "password": "testingPW1",
      "email": "testing@aol.com",
      "bio": "The testing bio"
    };

    const resp = await request(app)
          .post("/auth/register")
          .send(newUserData);
    
    // received bearer token for future requests.
    expect(resp.body).toEqual({"signedJWT": expect.any(String)});
  });
});