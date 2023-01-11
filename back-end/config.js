// Defined variable here- less prom to bugs when hard coded in multiple areas.

// returns the approporaite URI connection type and db
function getApproporiateDBEnv (){
  if(process.env.NODE_ENV === "test"){
    "postgresql:///firstfive_test"
  } else {
    // if environemnt variable (production) is not set it will default to firstfive uri.
    process.env.DATABASE_URL || "postgresql:///firstfive";
  }
}

// uses secret_key in priduction, otherwise defaults 
const SECRET_KEY = process.env.SECRET_KEY || "secret_key";
const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  getApproporiateDBEnv
};