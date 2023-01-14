// Defined environemnt variables here- less prom to bugs when hard coded in multiple areas.

// returns the approporaite URI connection type and db
function getApproporiateDBURI (){
  if(process.env.NODE_ENV === "test"){
    "firstfive_test"
  } else {
    // if env. variable (production) is not set it will default to firstfive uri.
    process.env.DATABASE_URL || "firstfive";
  }
}

// uses secret_key in production, otherwise defaults 
const SECRET_KEY = process.env.SECRET_KEY || "secret_key";
const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  getApproporiateDBURI
};