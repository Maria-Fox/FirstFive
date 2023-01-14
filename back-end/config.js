// Defined environemnt variables here- less prom to bugs when hard coded in multiple areas.

// returns the approporaite URI connection type and db. If in production the DATABASE_URL is defined, otherwise defaults to dev db.
function getApproporiateDBURI (){
  return process.env.NODE_ENV === "test" ? "firstfive_test" : process.env.DATABASE_URL || "firstfive"
}

// uses secret_key in production, otherwise defaults 
const SECRET_KEY = process.env.SECRET_KEY || "secret_key";
const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  getApproporiateDBURI
};