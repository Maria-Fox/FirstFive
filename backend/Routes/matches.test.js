const app = require("../app");
const request = require("supertest");
const {
  commonnBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  afterAllEnd,
  projectIds,
} = require("./forAllTests");
const createJWT = require("../HelperFunctions/Tokens");

// Using the jest testing functions pass in the steps needed to open/close serv.
beforeAll(commonnBeforeAll); // add in test data
beforeEach(commonBeforeEach); //start db 
afterEach(commonAfterEach); // rollback the previous changes
afterAll(afterAllEnd); //close connection to db

// To be matched
let user1Token = createJWT({ username: "test1" });
let user2Token = createJWT({ username: "test2" });

// Already matched from common data / when users create a project they are automatically matched to the project. 

let user3Token = createJWT({ username: "test3" });
let user4Token = createJWT({ username: "test4" });

// All routes prefixed with /matches

/************************************** POST /matches/add/:username/:project_id */

describe("Creating a match", function () {
  test("Creating valid match w/ auth user", async function () {
    // connects user 1 to project 3
    let project_id = projectIds[0];
    let resp = await request(app)
      .post(`/matches/add/test1/${project_id}`)
      .set({ "authorization": `Bearer ${user1Token}` })

    expect(resp.body).toEqual({
      id: expect.any(Number),
      project_id: project_id,
      username: "test1"
    })
  });

  test("Reject match if already matched", async function () {
    let project_id = projectIds[0];
    let resp = await request(app)
      .post(`/matches/add/test3/${project_id}`)
      .set({ "authorization": `Bearer ${user3Token}` })

    expect(resp.statusCode).toEqual(400);
  });

  test("Rejects unauth user sending match req", async function () {
    let project_id = projectIds[0];
    let resp = await request(app)
      .post(`/matches/add/test4/${project_id}`)
      .set({ "authorization": `Bearer ${user1Token}` })

    expect(resp.statusCode).toEqual(401)
  });
});

/************************************** GET /mathes/view/:username/all */
// Requires user login

describe("View matches for auth user", function () {

  test("Auth user requests own matches", async function () {
    let project_id = projectIds[0];
    let resp = await request(app)
      .get(`/matches/view/test3/all`)
      .set({ "authorization": `Bearer ${user3Token}` });

    // User is instantly matched w/ projects they create. Created in common test file.
    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual(
      [
        {
          project_id: project_id,
          project_desc: 'The third proj',
          name: 'Proj3',
          owner_username: 'test3',
          timeframe: '3 days',
          github_repo: 'https:github.com/3'
        }
      ]
    )
  });

  test("Invalid user requests user matches", async function () {
    let resp = await request(app)
      .get(`/matches/view/test3/all`)
      .set({ "authorization": `Bearer ${user1Token}` });

    // Unauth user response error
    expect(resp.statusCode).toEqual(401);
  });

  test("Unauth user requests user matches", async function () {
    let resp = await request(app)
      .get(`/matches/view/test3/all`)
      .set({ "authorization": `Bearer fakeToken` });

    // Unauth user response error
    expect(resp.statusCode).toEqual(401);
  });

});

/************************************** GET /matches/view/:project_id/users */
// Requires user to be signed in and matched the proejct.

// describe("See all users who matched with valid project id", function (){
//   test("Auth user views all users who matched project", async function (){
//     // match user 3 to project 4
//     let project_id = projectIds[1]
//     let newMatch = await request(app)
//     .post(`/matches/add/test3/${project_id}`)
//     .set({"authorization": `Bearer ${user3Token}`})

//     // confirm user 3 and user 4 are in project 4 matches
//     let resp = await request(app)
//     .get(`/matches/view/${project_id}/users`)
//     .set({authorization: `Bearer ${user3Token}`});

//     console.log(resp.body);
//   })
// });

describe("Unmatch from valid project_id", function () {
  test("User unmatches from project", async function () {
    let project_id = projectIds[1];
    let resp = await request(app)
      .post(`/matches/remove/test4/${project_id}`)
      .set({ authorization: `Bearer ${user4Token}` });

    expect(resp.statusCode).toEqual(200);
  });

  test("Invalid req - no authorization", async function () {
    let project_id = projectIds[0];
    let resp = await request(app)
      .post(`/matches/remove/test4/${project_id}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("Invalid project_id", async function () {
    let project_id = 7777;
    let resp = await request(app)
      .post(`/matches/remove/test4/${project_id}`)
      .set({ authorization: `Bearer ${user1Token}` });

    expect(resp.statusCode).toEqual(401);
  });


});

