const bcrypt = require("bcrypt");
const db = require("../db");
const {BCRYPT_WORK_FACTOR} = require("../config");

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
          ('test3', $3, 'test2@aol.com', 'Bio-3'),
          ('test4', $4, test4@yahoo.com, 'Bio-4')`, 
    [await hashPassword("firstPw"), 
    await hashPassword("secPW"), 
    await hashPassword("thirdPW"), 
    await hashPassword("fourthpw")]
  );

  await db.query(
    `INSERT INTO projects 
            (owner_username, name, project_desc, timeframe, github_repo)
    VALUES 
            ('test1', 'Proj1', 'The first test proj', '1 day', 'https:github.com/1'),
            ('test2', 'Proj2', 'The second proj', '2 days','https:github.com/2'),
            ('test3', 'Proj3', 'The third proj', '3 days','https:github.com/3'),
            ('test4', 'Proj4', 'The fourth proj', '4 days','https:github.com/4')` 
  );
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
  afterAllEnd
};