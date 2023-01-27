// Require library to test. App routes, db to test against.
const request = require("supertest");
const app = require("./app");
const db = require("./db");

// Test non-existant path
test("Invalid route -404", async function (){
  // read as "supertest(app).get..."
  const resp = await request(app).get("/invalid/route");
  expect(resp.statusCode).toEqual(404);
});

// "test" route.
test("Valid route -200", async function (){
  const resp = await request(app).get("/works");
  expect(resp.status).toEqual(200);
});

// Close connection to db once all tests are run.
afterAll(function () {
  db.end();
});
// describe('POST /users', function() {
//   it('responds with json', function(done) {
//     request(app)
//       .post('/users')
//       .send({name: 'john'})
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .end(function(err, res) {
//         if (err) return done(err);
//         return done();
//       });
//   });
// });