const db = require("../db");
const {ExpressError, UnauthorizedError, NotFoundError} = require("../ErrorHandling/expressError");
const Match = require("./match");
const {commonnBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  afterAllEnd,
  projectIds, matchIds} = require("./forAllTests");


// Using the jest testing functions pass in the steps needed to open/close serv.
beforeAll(commonnBeforeAll); // add in test data
beforeEach(commonBeforeEach); //start db 
afterEach(commonAfterEach); // rollback the previous changes
afterAll(afterAllEnd); //close connection to db

// Add match.***************************************** 

describe("Add match", function (){
  test("Add valid match", async function (){
    let newMatch = await Match.addMatch({project_id: projectIds[3], username: 'test1'});

    expect(newMatch.project_id).toEqual(projectIds[3]);
    expect(newMatch.username).toEqual('test1');

    let dbCheck = await db.query(
      `SELECT * 
      FROM matches
      WHERE project_id = $1 AND username = $2`,
      [projectIds[3], 'test1']
    );

    expect(dbCheck.rows.length).toEqual(1);
  });

  test("Deny duplicate match request", async function (){
    try{
      let dupMatch = await Match.addMatch({project_id: projectIds[1], username: 'test3'});
    } catch(e){
      expect(e instanceof ExpressError).toBeTruthy();
    };
  });
});

// View all USER matches.***************************************** 

describe("View all user matches", function (){
  test("View valid username matches", async function (){
    let user1Matches = await Match.viewAllUserMatches({username: 'test4'});
    expect(user1Matches).toEqual(
      [
        {
          project_id: projectIds[0],
          project_desc: 'The first test proj',
          name: 'Proj1',
          owner_username: 'test1',
          timeframe: '1 day',
          github_repo: 'https:github.com/1'
        },
        {
          project_id: projectIds[1],
          project_desc: 'The second proj',
          name: 'Proj2',
          owner_username: 'test2',
          timeframe: '2 days',
          github_repo: 'https:github.com/2'
        }
      ]
    )
  });

  test("Returns error if there are no user matches", async function () {
    try{
      let emptyMatches = await Match.viewAllUserMatches({username: "test1"});
    } catch(e){
      expect(e instanceof ExpressError).toBeTruthy();
    };
  });
});

// View all PROJECT matches.***************************************** 

describe("View project user matches", function (){

  test("View users who have matched project_id", async function (){
    let usersWhoMatched = await Match.viewProjectUserMatches({project_id: projectIds[0]});
    // console.log(usersWhoMatched);

    expect(usersWhoMatched).toEqual(
      {
        project_data: {
          proj_owner: 'test1',
          proj_name: 'Proj1',
          proj_desc: 'The first test proj',
          github_repo: 'https:github.com/1',
          timeframe: '1 day'
        },
        user_matches: {
          '0': { user_matched: 'test3', matched_user_bio: 'Bio-3' },
          '1': { user_matched: 'test4', matched_user_bio: 'Bio-4' }
        }
      }
    )
  });

  test("Invalid project id - returns error", async function (){
    try{
      let invalidProjId = await Match.viewProjectUserMatches({project_id: 32916});
    } catch(e){
      expect(e instanceof NotFoundError).toBeTruthy();
    };
  });

  test("Project w/ no matches returns error", async function (){
    try{
      let noMatchesForProj = await Match.viewProjectUserMatches({project_id: projectIds[3]});
    } catch(e){
      expect(e instanceof ExpressError).toBeTruthy();
    };
  });
});

// Unmatch user from project.***************************************** 

describe("Unmatch user from project id", function (){

  test("Unmatch valid user from valid project", async function (){
    let unmatchedProjId = await Match.unmatchUser({username: 'test4', project_id: projectIds[1]});

    expect(unmatchedProjId.project_id).toEqual(projectIds[1]);
  });

  test("Deny invalid username", async function (){
    try {
      let unmatchedUser = await Match.unmatchUser({username: 'test2', project_id: projectIds[3]});
    } catch(e){
      expect(e instanceof ExpressError).toBeTruthy();
    };
  });

  test("Deny invalid project_id", async function (){
    try {
      let unmatchedUser = await Match.unmatchUser({username: 'test4', project_id: projectIds[3]});
    } catch(e){
      expect(e instanceof ExpressError).toBeTruthy();
    };
  });
});

// Confirm if user has matched project.***************************************** 
// Used as middleware.

describe("Confirm weather or not user matched with project", function(){
  test("Valid match b/w user & project id", async function (){
    let validMatch = await Match.confirmUserMatched('test3', projectIds[0]);
    expect(validMatch.username).toEqual('test3');
    expect(validMatch.project_id).toEqual(projectIds[0]);
  });

  test("Invalid match b/w user & project", async function (){
    try{
      let invalidMatch = await Match.confirmUserMatched('test4', projectIds[3]);
    } catch(e){
      expect(e instanceof UnauthorizedError).toBeTruthy();
    };
  });
});

