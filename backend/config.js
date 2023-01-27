// Defined environment variables here- less prom to bugs when hard coded in multiple areas.

// Based on the assignment NODE_ENV the approporate DB_URL will be returned.
function getApproporiateDBURI (){
  return process.env.NODE_ENV === "test" ? "firstfive_test" : process.env.DATABASE_URL || "firstfive"
};

const PORT = +process.env.PORT || 3001;

// uses secret_key in production, otherwise defaults 
const SECRET_KEY = process.env.SECRET_KEY || "firstFive_secret_key";
const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  SECRET_KEY: SECRET_KEY,
  BCRYPT_WORK_FACTOR: BCRYPT_WORK_FACTOR,
  getApproporiateDBURI: getApproporiateDBURI,
  PORT: PORT
};