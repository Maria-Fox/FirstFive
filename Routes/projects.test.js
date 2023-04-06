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

let user1Token = createJWT({ username: "test1" });
let user3Token = createJWT({ username: "test3" });

/************************************** POST /projects/new */

describe("Creating a new project", function () {

  test("Auth user creating a new project", async function () {

    let newProjData = {
      owner_username: 'test1',
      name: "Testing",
      project_desc: "Description here",
      timeframe: "Short and easy!",
      github_repo: "https:github.com/firstfive"
    };

    let resp = await request(app)
      .post("/projects/add")
      .send(newProjData)
      .set({ authorization: `Bearer ${user1Token}` });

    let newProjId = resp.body.id;

    expect(resp.body).toEqual({
      id: newProjId,
      owner_username: 'test1',
      name: 'Testing',
      project_desc: 'Description here',
      timeframe: 'Short and easy!',
      github_repo: 'https:github.com/firstfive'
    });

    // confirm only the user who created the proj is matched at initialization.
    let matchConfirmation = await request(app)
      .get(`/matches/view/test1/all`)
      .set({ authorization: `Bearer ${user1Token}` });

    expect(matchConfirmation.statusCode).toEqual(200);
    expect(matchConfirmation.body).toEqual([{
      project_id: newProjId,
      project_desc: 'Description here',
      name: 'Testing',
      owner_username: 'test1',
      timeframe: 'Short and easy!',
      github_repo: 'https:github.com/firstfive'
    }])
  });


  test("Unauth user creating a new project", async function () {


    let resp = await request(app)
      .post("/projects/add")
      .set({ authorization: `Bearer ` });

    expect(resp.statusCode).toEqual(401)
  });


  test("Missing field data returns error", async function () {

    let newProjData = {
      owner_username: 'test1',
      project_desc: "Description here",
    };

    let resp = await request(app)
      .post("/projects/add")
      .send(newProjData)
      .set({ authorization: `Bearer ${user1Token}` });

    expect(resp.statusCode).toEqual(400)
  });


});

// ************************************** GET /projects/all */

describe("View all projects", function () {

  test("Valid user see's all projects", async function () {

    let resp = await request(app)
      .get(`/projects/all`)
      .set({ "authorization": `Bearer ${user3Token}` });

    expect(resp.body).toEqual(
      [
        {
          id: projectIds[0],
          owner_username: 'test3',
          name: 'Proj3',
          project_desc: 'The third proj',
          timeframe: '3 days',
          github_repo: 'https:github.com/3'
        },
        {
          id: projectIds[1],
          owner_username: 'test4',
          name: 'Proj4',
          project_desc: 'The fourth proj',
          timeframe: '2 days',
          github_repo: 'https:github.com/2'
        }
      ]
    )
    expect(resp.statusCode).toEqual(200);
  });

  test("No auth user sees error", async function () {

    let resp = await request(app)
      .get(`/projects/all`)
      .set({ "authorization": `Bearer $` });

    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /projects/:project_id */

describe("View valid project id data", function () {

  test("View valid project id from auth user", async function () {
    let project_id = projectIds[0];

    let resp = await request(app)
      .get(`/projects/${project_id}`)
      .set({ "authorization": `Bearer ${user1Token}` });

    expect(resp.body).toEqual({
      id: project_id,
      owner_username: "test3",
      name: "Proj3",
      project_desc: "The third proj",
      timeframe: "3 days",
      github_repo: "https:github.com/3"
    });
    expect(resp.statusCode).toEqual(200);
  });

  test("Invalid project id from auth user- returns 404", async function () {
    let project_id = 42222;

    let resp = await request(app)
      .get(`/projects/${project_id}`)
      .set({ "authorization": `Bearer ${user1Token}` });

    expect(resp.statusCode).toEqual(404);
  });

  test("Unauth user returns 401", async function () {
    let project_id = projectIds[0];

    let resp = await request(app)
      .get(`/projects/${project_id}`)
      .set({ "authorization": `Bearer ` });

    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** PATCH /projects/:project_id */

describe("Update project if project_owner", function () {

  test("Update user project", async function () {
    let project_id = projectIds[0];

    let updatedProjData = {
      owner_username: "test3",
      name: "Proj3- UPDATED",
      project_desc: "The third proj- UPDATED",
      timeframe: "3 days- UPDATED",
      github_repo: "https:github.com/3-UPDATED"
    }

    let resp = await request(app)
      .patch(`/projects/${project_id}`)
      .set({ "authorization": user3Token })
      .send(updatedProjData);

    expect(resp.body).toEqual({
      id: project_id,
      ...updatedProjData
    });
  });

  test("Error- missing field update w/ auth user, 400", async function () {
    let project_id = projectIds[0];

    let updatedProjData = {
      timeframe: "3 days- UPDATED",
      github_repo: "https:github.com/3-UPDATED"
    }

    let resp = await request(app)
      .patch(`/projects/${project_id}`)
      .set({ "authorization": user3Token })
      .send(updatedProjData);

    expect(resp.statusCode).toEqual(400);
  });

  test("Unauth user returns 401 - no login", async function () {
    let project_id = projectIds[0];

    let resp = await request(app)
      .patch(`/projects/${project_id}`)

    expect(resp.statusCode).toEqual(401);
  });

  test("Unauth user returns 401- not owner", async function () {
    let project_id = projectIds[0];

    let resp = await request(app)
      .patch(`/projects/${project_id}`)
      .set({ "authorization": `Bearer ${user1Token}` });

    expect(resp.statusCode).toEqual(401);
  });

  test("Invalid proj_id- returns 404", async function () {
    let project_id = 4656564;

    let resp = await request(app)
      .patch(`/projects/${project_id}`)
      .set({ "authorization": `Bearer ${user1Token}` });

    expect(resp.statusCode).toEqual(404);
  });


});

/************************************** DELETE /projects/:project_id */

describe("Deleting valid proj_id", function () {
  test("Allow auth user + proj_owner to delete project", async function () {
    let project_id = projectIds[0];

    let resp = await request(app)
      .delete(`/projects/${project_id}`)
      .set({ authorization: `Bearer ${user3Token}` });

    expect(resp.statusCode).toEqual(200);
  });

  test("Deny unauth user to delete project", async function () {
    let project_id = projectIds[0];

    let resp = await request(app)
      .delete(`/projects/${project_id}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("Deny NON-PROJECT_OWNER ability to delete project", async function () {
    let project_id = projectIds[0];

    let resp = await request(app)
      .delete(`/projects/${project_id}`)
      .set({ authorization: `Bearer ${user1Token}` });

    expect(resp.statusCode).toEqual(401);
  });
});