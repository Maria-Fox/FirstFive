const {Client} = require("pg");
let {getApproporiateDBEnv} = require("./config");

let db;

if(process.env.NODE_ENV === "production"){
  db = new Client({connectionString :getApproporiateDBEnv(),
  ssl: {
    rejectUnauthorized: false
  }})
} else {
  // will return URI based on whether it's in test or not.
  db = new Client({
    connectionString : getApproporiateDBEnv()
  });
};

db.connect();

// establish & export conenction
module.exports = db;