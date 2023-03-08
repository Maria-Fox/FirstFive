const db = require("../db");
const User = require("../Models/user");
const Project = require("../Models/project");
const Project_Member = require("../Models/projectMember");
const Match = require("../Models/match");
const Message = require("../Models/message");
const createJWT = require("../HelperFunctions/Tokens");

const projectIds = [];
const matchIds = [];
const projectMemberIds = [];
const messageIds = [];

// Delete all items in each table.
async function commonnBeforeAll() {
  await db.query(`DELETE FROM messages`);
  await db.query(`DELETE FROM matches`);
  await db.query(`DELETE FROM project_members`);
  await db.query(`DELETE FROM projects`);
  await db.query(`DELETE FROM users`);


  // Create users **************************
  await User.register({
    username: 'test1',
    password: "firstPw",
    email: "test1@email.com",
    bio: "Bio-1"
  });

  await User.register({
    username: 'test2',
    password: "secPW",
    email: "test2@email.com",
    bio: "Bio-2"
  });

  await User.register({
    username: 'test3',
    password: "thirdPW",
    email: "test3@email.com",
    bio: "Bio-3"
  });

  await User.register({
    username: 'test4',
    password: "fourthPW",
    email: "test4@email.com",
    bio: "Bio-4"
  });

  let project3 = {
    owner_username: "test3",
    name: "Proj3",
    project_desc: "The third proj",
    timeframe: "3 days",
    github_repo: "https:github.com/3"
  };

  let project4 = {
    owner_username: "test4",
    name: "Proj4",
    project_desc: "The fourth proj",
    timeframe: "2 days",
    github_repo: "https:github.com/2"
  };

  //***************************************** 
  // Create projects & insert projectid's in array.
  projectIds[0] = (await Project.createProject(project3)).id;
  projectIds[1] = (await Project.createProject(project4)).id;

  // don't need to match anymore.

  // let matchUser3ToProj4 = {
  //   project_id: projectIds[0],
  //   username: "test3"
  // };

  // let matchUser4ToProj3 = {
  //   project_id: projectIds[1],
  //   username: "test4"
  // };

  //***************************************** 
  // Match users to projects. Insert match id into match array.
  // matchIds[0] = await Match.addMatch(matchUser3ToProj4);
  // matchIds[1] = await Match.addMatch(matchUser4ToProj3);


  //***************************************** 
  // Add project members to projects. Insert project_member id's in array.

  // let member3InProj4 = ({project_id: projectIds[0]}, {username: 'test3'});
  // let member4InProj3 = ({project_id: projectIds[1]}, {username: 'test4'});

  projectMemberIds[0] = await Project_Member.addMember({ project_id: projectIds[0] }, { username: 'test3' });
  projectMemberIds[1] = await Project_Member.addMember({ project_id: projectIds[1] }, { username: 'test4' });

  //***************************************** 
  // Add Messages. Insert id's into messageId array.

  // let msgFrom3To4 = ('test4', {message_to: "test4", body: "This is from user 3 to user 4"});

  // let msgFrom4To3 = ({
  //   message_from: "test4",
  //   message_to: "test3",
  //   body: "This is from user 4 to user 3"
  // });


  // messageIds[0] = await Message.createMessage(msgFrom3To4);
  // messageIds[1] = await Message.createMessage(msgFrom4To3);

  console.log({
    projectIds,
    //   projectMemberIds,
    //   matchIds,
    // messageIds
  });

};


// Initiates/starts transaction
async function commonBeforeEach() {
  await db.query("BEGIN");
};

// Rolls back transaction/ changes.
async function commonAfterEach() {
  await db.query("ROLLBACK");
};

// closes connection to server.
async function afterAllEnd() {
  await db.end();
};




module.exports = {
  commonnBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  afterAllEnd,
  projectIds,
  projectMemberIds,
  matchIds,
  messageIds
};