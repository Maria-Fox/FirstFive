const request = require("supertest");
const app = require("../app");
const {
  commonnBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  afterAllEnd,
} = require("./forAllTests");
const createJWT = require("../HelperFunctions/Tokens");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");


// Using the jest testing functions pass in the steps needed to open/close serv.
beforeAll(commonnBeforeAll); // add in test data
beforeEach(commonBeforeEach); //start db 
afterEach(commonAfterEach); // rollback the previous changes
afterAll(afterAllEnd); //close connection to db

let user3Token = createJWT({ username: "test3" });
let user4Token = createJWT({ username: "test4" });


// all routes prefixed with "/users"

/************************************** GET /users/all */

describe("/GET View all users", function () {
  test("/GET valid user requesting all", async function () {
    let allUsers = await request(app)
      .get("/users/all")
      .set("authorization", `Bearer ${user3Token}`);

    expect(allUsers.body).toEqual({
      allUsers: [
        {
          username: 'test1',
          email: "test1@email.com",
          bio: "Bio-1"
        },
        {
          username: 'test2',
          email: "test2@email.com",
          bio: "Bio-2"
        },
        {
          username: 'test3',
          email: "test3@email.com",
          bio: "Bio-3"
        },
        {
          username: 'test4',
          email: "test4@email.com",
          bio: "Bio-4"
        }
      ],
    });
  });

  test("Invalid credentials/ user request", async function () {
    let allUsersRes = await request(app)
      .get("/users/all");

    expect(allUsersRes.statusCode).toEqual(401);
  });

});

/************************************** GET /users/:username */

describe("/GET :username", function () {
  test("Returns same user", async function () {
    const resp = await request(app)
      .get(`/users/test3`)
      .set("authorization", `Bearer ${user3Token}`);
    expect(resp.body).toEqual({
      userData: {
        username: "test3",
        bio: "Bio-3"
      },
    });
  });

  test("Returns different user", async function () {
    const resp = await request(app)
      .get(`/users/test4`)
      .set("authorization", `Bearer ${user3Token}`);
    expect(resp.body).toEqual({
      userData: {
        username: "test4",
        bio: "Bio-4"
      },
    });
  });

  test("Denies unauthorized user", async function () {
    const resp = await request(app)
      .get(`/users/test3`);
    expect(resp.statusCode).toEqual(401);
  });

  test("Returns not found if user not found", async function () {
    const resp = await request(app)
      .get(`/users/fakeUser`)
      .set("authorization", `Bearer ${user3Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});


/************************************** PATCH /users/:username */

describe("PATCH /users/:username", function () {
  test("Updates auth user", async function () {

    const resp = await request(app)
      .patch(`/users/test3`)
      .send({
        username: "test3",
        bio: "New Bio",
      })
      .set("authorization", `Bearer ${user3Token}`);
    expect(resp.body).toEqual({
      userData: {
        username: "test3",
        email: "test3@email.com",
        bio: "New Bio",
      },
    });
  });

  test("Deny updating unauth user", async function () {

    const resp = await request(app)
      .patch(`/users/test3`)
      .send({
        username: "test3",
        bio: "New Bio",
      })
      .set("authorization", `Bearer `);
    expect(resp.statusCode).toEqual(401);
  });

  test("Returns bad request error if missing fields", async function () {

    const resp = await request(app)
      .patch(`/users/test3`)
      .send({
        bio: "New Bio",
      })
      .set("authorization", `Bearer ${user3Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /users/:username */

describe("Delete auth user acc", function () {
  test("Delete auth user acct", async function () {
    let resp = await request(app)
      .delete(`/users/test3`)
      .set({ "authorization": `Bearer ${user3Token}` });

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      "Success": "Deleted user"
    });
  });

  test("Deny deleting user to unauth user", async function () {
    let resp = await request(app)
      .delete(`/users/test4`)
      .set({ "authorization": `Bearer ${user3Token}` });

    expect(resp.statusCode).toEqual(401);
  });
});
