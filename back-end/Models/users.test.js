const db = require("../db");
const User = require("./user");
const { commonnBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  afterAllEnd} = require("./forAllTests");
const { BadRequestError } = require("../ErrorHandling/expressError");
const { BCRYPT_WORK_FACTOR } = require("../config");

  // Using the jest testing function pass in the steps needed to open/close serv.
// Initate server / rollback transactions / end connection to server.
beforeAll(commonnBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(afterAllEnd);


// Register User***************************************** 

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
    expect(newUserRes.password).toEqual("pw123");
    expect(newUserData.bio).toEqual("bio - new");

    // Test db query/ entry
    const newUserQuery = await db.query(`SELECT * from USERS WHERE username = "newestUser01"`);
    expect(newUserQuery.rows.length).toEqual(1);
    expect(newUserQuery.rows[0].bio).toEqual("bio - new");
  });

  // test("Duplicate username- responds w/ BadRequestError", function () {

  //   let dupUserData = {
  //     username : "test1",
  //     password: "pw123",
  //     email : "testingtheemail@aol.com",
  //     bio: "bio - new"
  //   };

  //   let duplicateUserRes = await User.register(dupUserData);
  //   expect(duplicateUserRes instanceof BadRequestError).toBeTruthy();
  // });
});


