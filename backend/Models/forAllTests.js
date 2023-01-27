const bcrypt = require("bcrypt");
const db = require("../db");
const {BCRYPT_WORK_FACTOR} = require("../config");
const { app } = require("../app");

const projectIds = [];
const matchIds = [];
const projectMemberIds = [];
const messageIds = [];

// Delete all items in each table.
async function commonnBeforeAll(){
  await db.query(`DELETE FROM messages`);
  await db.query(`DELETE FROM matches`);
  await db.query(`DELETE FROM project_members`);
  await db.query(`DELETE FROM projects`);
  await db.query(`DELETE FROM users`);

  let hashPassword  = async function(givenPassword) {
    return bcrypt.hash(givenPassword, BCRYPT_WORK_FACTOR);
  };

  await db.query(
    `INSERT INTO users (username, password, email, bio)
    VALUES ('test1', $1, 'test1@email.com', 'Bio-1'),
          ('test2', $2, 'test2gmail.com', 'Bio-2'),
          ('test3', $3, 'test3@aol.com', 'Bio-3'),
          ('test4', $4, 'test4@aol.com', 'Bio-4')`, 
    [await hashPassword("firstPw"), 
    await hashPassword("secPW"), 
    await hashPassword("thirdPW"),
    await hashPassword("fourthPW")]
  );

  const newProjects = await db.query(
    `INSERT INTO projects 
            (owner_username, name, project_desc, timeframe, github_repo)
    VALUES 
            ('test1', 'Proj1', 'The first test proj', '1 day', 'https:github.com/1'),
            ('test2', 'Proj2', 'The second proj', '2 days','https:github.com/2'),
            ('test3', 'Proj3', 'The third proj', '3 days','https:github.com/3'),
            ('test4', 'Proj4', 'The fourth proj', '4 days', 'https:github.com/4')
    RETURNING id`);


    // We return the newly added proect ID's then add to array to test w/ later.
    // starting at 0 index, removing 0, adding in all row id's
    projectIds.splice(0, 0, ...newProjects.rows.map(r => r.id));
    console.log("****The project ids are: ", projectIds);

  const matches = await db.query(
      `INSERT INTO matches (project_id, username)
      VALUES ($1, 'test3'),
            ($2, 'test3'),
            ($3, 'test4'),
            ($4, 'test4')
      RETURNING id`,
      [projectIds[0], projectIds[1], projectIds[0], projectIds[1]]);

  matchIds.splice(0, 0, ...matches.rows.map(r => r.id));
  // console.log("***Matches id's are: ", matchIds);


  const project_members_added = await db.query(
      `INSERT INTO project_members (project_id, username)
      VALUES ($1, 'test4'),
            ($2, 'test3'),
            ($3, 'test3'),
            ($4, 'test4')
      RETURNING id`,
    [projectIds[0], projectIds[0], projectIds[1], projectIds[1]]);

    // effectively connects project_id 1 => users 4 and 3
    // project_2 => users 3 and 4
    projectMemberIds.splice(0, 0, ...project_members_added.rows.map(r => r.id));
    // console.log("***Project member id's are: ", projectMemberIds);

  const messages = await db.query(
      `INSERT INTO messages (message_from, message_to, body, sent_at)
      ValUES 
          ($1, $2, 'This is from user 3 to user 4', current_timestamp),
          ($3, $4, 'This is from user 4 to user 3', current_timestamp)
          RETURNING id`,
          ['test3', 'test4', 'test4', 'test3']);

      messageIds.splice(0, 0, ...messages.rows.map(r => r.id));
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
async function afterAllEnd(){
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