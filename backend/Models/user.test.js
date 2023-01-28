const db = require("../db");
const User = require("./user");
const { commonnBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  afterAllEnd} = require("./forAllTests");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../ErrorHandling/expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");
const bcryt = require("bcrypt");

// Using the jest testing functions pass in the steps needed to open/close serv.
beforeAll(commonnBeforeAll); // add in test data
beforeEach(commonBeforeEach); //start db 
afterEach(commonAfterEach); // rollback the previous changes
afterAll(afterAllEnd); //close connection to db


// Register User***************************************** 

// All fields are required via HTML & verified thorugh registerUser.json. Therefore, no tests are completed for missing params.

describe("Register user", function () {
  test("Valid input", async function () {
    let newUserData = {
      username : "newestUser01",
      password: "pw123",
      email : "testingtheemail@aol.com",
      bio: "bio - new"
    };

    let newUserRes = await User.register(newUserData);

    // Test model response
    expect(newUserRes.username).toEqual("newestUser01");
    expect(newUserData.bio).toEqual("bio - new");

    // Test db query/ entry
    const newUserQuery = await db.query(`SELECT * from USERS WHERE username = $1`, [newUserData.username]);
    expect(newUserQuery.rows.length).toEqual(1);
    expect(newUserQuery.rows[0].bio).toEqual("bio - new");
  });

  test("Duplicate username- responds w/ BadRequestError", async function () {

    try {
      let dupUserData = {
        username : "test1",
        password: "pw123",
        email : "testingtheemail@aol.com",
        bio: "bio - new"
      };
      let duplicateUserRes = await User.register(dupUserData);

    } catch (e){
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  });
});

// Authenticate User***************************************** 
// Checks users added into test db forAllTests.js

describe("Authenticate user against db, return app results", function () {
    test("Valid user credenetials return authorized user", async function () {

        let userData = {username: "test1", password: "firstPw"};

        let validUser = await User.authenticateUser(userData);
        expect(validUser.username).toEqual(userData.username);
    });

    test("Invalid user credentials return error", async function (){
      try{
        let userData = {username: "test1", password: "fake_pw_here"};

        let validUser = await User.authenticateUser(userData);
      } catch(e){
        expect(e instanceof UnauthorizedError).toBeTruthy();
      };
    });
});

describe("Return all users", function (){
  test("Return all users in db.", async function (){
    let allDBUsers = await User.findAllUsers();
    expect(allDBUsers).toBeTruthy();
    expect(allDBUsers.length).toEqual(4);
    expect(allDBUsers[0].username).toEqual("test1");
  });
});

describe("Return given user", function (){
  test("Return info w/ valid username", async function (){
    let user = {"username": "test1"}
    let validUser = await User.findUser(user);

    expect(validUser.username).toEqual("test1");
    expect(validUser.bio).toEqual("Bio-1");
  });

  test("Return error w/invalid username", async function (){
    try{
      let invalidUser = {"username": "madeUpUser"}
      let invalidUserResult = await User.findUser(invalidUser);

    }catch(e){
      expect(e instanceof NotFoundError).toBeTruthy();
    };
  });
});


// Update User***************************************** 
// route middleware exists so only auth users can update their profile.
describe("Update user profile details based on columns for edits", function () {
  test("Update valid columns w/ given data", async function (){

    let fieldsToUpdate = {
      "password" : "newPW",
      "email": "newEmail",
      "bio" : "new bio"
    };

    let username = {username: 'test1'}

    let updatedUser = await User.updateUserProfile(username, fieldsToUpdate); 
    expect(updatedUser).toEqual({
      "username": "test1",
      "email": "newEmail",
      "bio" : "new bio"
    });

    let updatedQuery = await db.query(
        `SELECT * 
        FROM users
        WHERE username = $1`,
        ['test1']
    );

    expect(updatedQuery.rows[0].email).toEqual("newEmail");
    expect(updatedQuery.rows[0].bio).toEqual("new bio");
  });
});

// Delete User***************************************** 
describe("Delete user", function (){
  // route middleware exists so only auth users can access method. Otherwise, they see an unauthorized error returned. Checked in middleware.

  test("Delete valid user", async function (){
    let deletedUser = await User.deleteUser({"username": "test1"});
    
    let deletedUserConfirmation = await db.query(`
                                        SELECT * 
                                        FROM users 
                                        WHERE username = 'test1'`);

    expect(deletedUserConfirmation.rows.length).toEqual(0);
  });
});
