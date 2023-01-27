const app = require("../app");
const request = require("supertest");
const {  commonnBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  afterAllEnd,
  projectIds,} = require("./forAllTests");
const createJWT = require("../HelperFunctions/Tokens");

// Using the jest testing functions pass in the steps needed to open/close serv.
beforeAll(commonnBeforeAll); // add in test data
beforeEach(commonBeforeEach); //start db 
afterEach(commonAfterEach); // rollback the previous changes
afterAll(afterAllEnd); //close connection to db

let user1Token = createJWT({username: "test1"});
let user3Token = createJWT({username: "test3"});
let user4Token = createJWT({username: "test4"});

// Users must be matched to the project in order to be added as project_members FROM THE PROJECT_OWNER

/************************************** POST /projectmembers/add/:project_id */

// describe("Adding proj member to valid project_id", function(){

//   test("Proj owner adding to group project members", async function(){
//     let projectByUser3 = projectIds[0];
    
//     // model expects both, sending in as one obj. to save memory here.
//     let newUserData = {
//       project_id: projectByUser3,
//       username: "test1"
//     };
    
//     let resp = await request(app)
//               .post(`/projectmembers/add/${projectByUser3}`)
//               .send(newUserData)
//               .set({authorization: `Bearer ${user3Token}`});
    
//     console.log(resp.body)
    
    // expect(resp.body).toEqual({
    //   id: expect.any(Number),
    //   ...newUserData
    // });

  //   expect(resp.statusCode).toEqual(201);
  // });

  // test("Proj owner missing required fields", async function(){
  //   let projectByUser3 = projectIds[0];

  //   let newUserData = {
  //     project_id: projectByUser3
  //   };
    
  //   let resp = await request(app)
  //             .post(`/projectmembers/add/${projectByUser3}`)
  //             .send(newUserData)
  //             .set({authorization: `Bearer ${user3Token}`});

  //   expect(resp.statusCode).toEqual(400);
  // });

  //   test("Proj owner missing required fields", async function(){
  //   let projectByUser3 = projectIds[0];

  //   let newUserData = {
  //     project_id: projectByUser3
  //   };
    
  //   let resp = await request(app)
  //             .post(`/projectmembers/add/${projectByUser3}`)
  //             .send(newUserData)
  //             .set({authorization: `Bearer ${user3Token}`});

  //   expect(resp.statusCode).toEqual(400);
  // });

  //   test("Non project owner see's 401", async function(){
  //   let projectByUser3 = projectIds[0];

  //   let newUserData = {
  //     project_id: projectByUser3
  //   };
    
  //   let resp = await request(app)
  //             .post(`/projectmembers/add/${projectByUser3}`)
  //             .send(newUserData)
  //             .set({authorization: `Bearer ${user1Token}`});

  //   expect(resp.statusCode).toEqual(401);
  // });

  // test("Non auth user sends request see's 401", async function(){
  //   let projectByUser3 = projectIds[0];

  //   let newUserData = {
  //     project_id: projectByUser3
  //   };
    
  //   let resp = await request(app)
  //             .post(`/projectmembers/add/${projectByUser3}`)
  //             .send(newUserData)

  //   expect(resp.statusCode).toEqual(401);
  // });

  // test("Invalid Proj id- returns ", async function(){
  //   let projectByUser3 = 95161;

  //   let newUserData = {
  //     project_id: projectByUser3
  //   };
    
  //   let resp = await request(app)
  //             .post(`/projectmembers/add/${projectByUser3}`)
  //             .send(newUserData)
  //             .set({authorization: `Bearer ${user3Token}`});

  //   expect(resp.statusCode).toEqual(404);
  // });
// });

/************************************** GET /projectmembers/view/all/:project_id */

describe("View all project members if user is matched", function (){
  // user 3 made project3, instantly matched.
  // test("Auth user + proj_owner + matched can see all project users", async function (){
  //   // first adding an additional match to common proj
  //   let projectByUser3 = projectIds[0];

  //   let newUserData = {
  //     project_id: projectByUser3,
  //     username: "test1"
  //   };
    
  //   let newMatch = await request(app)
  //             .post(`/projectmembers/add/${projectByUser3}`)
  //             .send(newUserData)
  //             .set({authorization: `Bearer ${user3Token}`});

  //   let resp = await request(app)
  //         .get(`/projectmembers/view/all/${projectByUser3}`)
  //         .set({authorization: `Bearer ${user3Token}`});

  //   expect(resp.body).toEqual({
  //     proj_members: {
  //       '0': { username: 'test3', bio: 'Bio-3' },
  //       '1': { username: 'test1', bio: 'Bio-1' }
  //     }
  //   })
  // });

  test("Not project_owner but matched can see all project users", async function (){
    let projectByUser3 = projectIds[0];

    let newUserData = {
      project_id: projectByUser3,
      username: "test4"
    };

    let newMatch = await request(app)
          .post(`/projectmembers/add/${projectByUser3}`)
          .send(newUserData)
          .set({authorization: `Bearer ${user3Token}`});

    console.log(newMatch)

    let resp = await request(app)
          .get(`/projectmembers/view/all/${projectByUser3}`)
          .set({authorization: `Bearer ${user4Token}`});

    console.log(resp.body);
    expect(resp.statusCode).toEqual(200);
  });

  // test("Auth user NOT MATCHED cannot see project users", async function (){
  //   let projectByUser3 = projectIds[0];

  //   let resp = await request(app)
  //         .get(`/projectmembers/view/all/${projectByUser3}`)
  //         .set({authorization: `Bearer ${user1Token}`});

  //   expect(resp.statusCode).toEqual(401);
  // });
});
