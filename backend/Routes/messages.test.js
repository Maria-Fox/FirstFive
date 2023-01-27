const app = require("../app")
const request = require("supertest");
const {
  commonnBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  afterAllEnd,
} = require("./forAllTests");
const createJWT = require("../HelperFunctions/Tokens");

// Using the jest testing functions pass in the steps needed to open/close serv.
beforeAll(commonnBeforeAll); // add in test data
beforeEach(commonBeforeEach); //start db 
afterEach(commonAfterEach); // rollback the previous changes
afterAll(afterAllEnd); //close connection to db

let user1Token = createJWT({username: "test1"});
let user3Token = createJWT({username: "test3"});
let user4Token = createJWT({username: "test4"});

// Option to message someone is only available on the front-end for users who are matched with the project. Otherwise, not an optiion.

/************************************** POST messages/:username/create */

// describe("Auth user creates message", function (){

  // test("Auth user can msg auth user", async function (){

  // let msgData = { 
  //   "message_to": "test4",
  //   "body": "This is from 3 to 4"
  // };

  //   let resp = await request(app)
  //         .post(`/messages/test3/create`)
  //         .send(msgData)
  //         .set({authorization: `Bearer ${user3Token}`});

  //   console.log(resp.body);
  //   expect(resp.body).toEqual(
  //     {
  //       id: expect.any(Number),
  //       message_from: 'test3',
  //       message_to: 'test4',
  //       body: 'This is from 3 to 4',
  //       sent_at: expect.any(String)
  //     }
  //   )
  //   expect(resp.statusCode).toEqual(201);
  // });

  // test("Unauth user received 401", async function (){

  //   let msgData = { 
  //     "message_to": "test4",
  //     "body": "This is from 3 to 4"
  //   };
  
  //     let resp = await request(app)
  //           .post(`/messages/test3/create`)
  //           .send(msgData)
  //           .set({authorization: ""});
  
  //     expect(resp.statusCode).toEqual(401);
  //   });

  // test("No msg data returns 400", async function (){
    
  //       let resp = await request(app)
  //             .post(`/messages/test3/create`)
  //             .send({})
  //             .set({authorization: `Bearer ${user3Token}`});
    
  //       expect(resp.statusCode).toEqual(400);
  //     });

  // test("Invalid user creating msg from someone other than themself- received 401", async function (){
    
  //       let resp = await request(app)
  //             .post(`/messages/test4/create`)
  //             .set({authorization: `Bearer ${user3Token}`});
    
  //       expect(resp.statusCode).toEqual(401);
  //     });

  // test("Auth user missing field data", async function (){

  //   let msgData = { 
  //     "body": "This is from 3 to 4"
  //   };

  //     let resp = await request(app)
  //           .post(`/messages/test3/create`)
  //           .send(msgData)
  //           .set({authorization: `Bearer ${user3Token}`});

  //     expect(resp.statusCode).toEqual(400);
  //   });

  // test("Auth user invalid field data", async function (){

  //     let msgData = { 
  //       "username": "fakeUser",
  //       "body": "This is from 3 to 4"
  //     };
    
  //       let resp = await request(app)
  //             .post(`/messages/test3/create`)
  //             .send(msgData)
  //             .set({authorization: `Bearer ${user3Token}`});
    
  //       expect(resp.statusCode).toEqual(400);
  //     });

// });

/************************************** GET messages/:username/all */

describe("View auth users messages", function () {

  // test("Auth user see's all their messages", async function (){
  //   // Need to get sample msg's to test. Otherwise, I have to create and then get all.
  // });

  test("Non auth user req someone's msg's", async function (){
    let resp = await request(app)
          .get(`/messages/test4/all`)
          .set({authorization: `Bearer ${user1Token}`});

    expect(resp.statusCode).toEqual(401);
  });

  test("User unable to access msg's w/o sign in", async function (){
    let resp = await request(app)
          .get(`/messages/test4/all`)
          .set({authorization: `Bearer`});

    expect(resp.statusCode).toEqual(401);
  });
});
