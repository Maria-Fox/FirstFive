const Project = require("./project");
const sqlForPartialUpdate = require("../HelperFunctions/SQLHelpers");
const db = require("../db");
const {ExpressError, NotFoundError, UnauthorizedError, BadRequestError} = require("../ErrorHandling/expressError");
const {commonnBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  afterAllEnd,
  projectIds} = require("./forAllTests");
const Matches = require("./match");


// Using the jest testing functions pass in the steps needed to open/close serv.
beforeAll(commonnBeforeAll); // add in test data
beforeEach(commonBeforeEach); //start db 
afterEach(commonAfterEach); // rollback the previous changes
afterAll(afterAllEnd); //close connection to db

// Create project.***************************************** 

describe("Create a project", function () {
  test("Create project w/ valid input.", async function () {
    let newProjData = {
      "owner_username": "test1",
      "name": "Test project added",
      "project_desc": "To test the model",
      "timeframe": "1 day",
      "github_repo": "https:github/test"
    };
    
    let newProjectResponse = await Project.createProject(newProjData);
    let projId = newProjectResponse.id;
    expect(newProjectResponse.project_desc).toEqual("To test the model");
    expect(newProjectResponse).toEqual(
    {
        ...newProjData,
        id: expect.any(Number)
    }
  )

    let dbRequest = await db.query(
      `SELECT * 
      FROM 
      projects
      WHERE name = $1`,
      [newProjData.name]
    );

    expect(dbRequest.rows[0].github_repo).toEqual("https:github/test");
    expect(dbRequest.rows[0].owner_username).toEqual(newProjData.owner_username);

    let userMatchedToProj = await Matches.viewProjectUserMatches(projId);
    expect(userMatchedToProj.rows.length).toEqual(1);
  });


});

// View all projects.***************************************** 

// describe("View all projects", function () {
//   test("Auth user view all projects", async function () {
//     let allProjects = await Project.viewAllProjects();
//     expect(allProjects.length).toEqual(4);
//       expect(allProjects[0].name).toEqual("Proj1");
//       expect(allProjects[1].name).toEqual("Proj2");
//       expect(allProjects[2].name).toEqual("Proj3");
//       expect(allProjects[3].name).toEqual("Proj4");
//   });
// });

// // View single project details.***************************************** 

// describe("Valid user requests project id details", function (){
//   test("Request valid project id details", async function (){
//     let proj1Data = await Project.viewSingleProject({project_id: projectIds[0]});
//     expect(proj1Data.owner_username).toEqual("test1");
//     expect(proj1Data.project_desc).toEqual("The first test proj");
//     expect(proj1Data.github_repo).toEqual("https:github.com/1");
//   });

//   test("Request invalid project id return error", async function () {
//     try{
//       let invalidRequest = await Project.viewSingleProject({project_id: 999});
//     } catch(e){
//       expect(e instanceof NotFoundError).toBeTruthy();
//     };
//   });
// });

// // Update Project***************************************** 

// describe("Update proect details", function (){
//   test("Update valid project_id", async function(){
//     let dataForUpdate = {
//       "name": "Updated name",
//       "project_desc": "Updated desc",
//       "timeframe": "Updated timeframe",
//       "github_repo": "updated repo"
//     };

//     let updatedProj = await Project.updateProject({project_id: projectIds[0]}, dataForUpdate);

//     expect(updatedProj.name).toEqual("Updated name");
//     expect(updatedProj.github_repo).toEqual("updated repo");

//     let queryResult = await db.query(
//       `SELECT *
//       FROM projects
//       WHERE id = $1`,
//       [projectIds[0]]
//     );

//     expect(queryResult.rows[0].project_desc).toEqual("Updated desc");
//     expect(queryResult.rows[0].timeframe).toEqual("Updated timeframe");
//   });

//   test("Update invalid project id", async function (){
//     try{
//         let dataForUpdate = {
//       "name": "Updated name",
//       "project_desc": "Updated desc",
//       "timeframe": "Updated timeframe",
//       "github_repo": "updated repo"
//     };
//       let invalidUpdateID = await Project.updateProject({project_id: 99999}, dataForUpdate);
//       console.log("****", invalidUpdateID)
//     } catch (e){
//       expect(e instanceof NotFoundError).toBeTruthy();
//     };
//   });
// });

// // Delete project.***************************************** 

// describe("Deleting project via id", function () {
//   test("Valid id & owner_username delete project", async function () {
//     let username = 'test1'
//     let deleteProj1 = await Project.delete(projectIds[0], username);
    
//     expect(deleteProj1.owner_username).toEqual("test1");

//     let dbCheck = await db.query(
//       `SELECT *
//       FROM projects
//       WHERE id = $1`,
//       [projectIds[0]]
//     );

//     expect(dbCheck.rows.length).toEqual(0);
//   });

//   test("Invalid project id for deleting, returns error", async function (){
//     try{
//       let invalidRequest = await Project.delete(9999, 'testuser1');
//     } catch(e){
//       expect(e instanceof NotFoundError).toBeTruthy();
//     };
//   });

//   test("Invalid project_owner sending request for valid id- deny", async function (){
//     try {
//       let invalidOwnerReq = await Project.delete(projectIds[1], 'testuser4');
//     } catch (e){
//       expect(e instanceof NotFoundError).toBeTruthy();
//     };
//   });
// });
