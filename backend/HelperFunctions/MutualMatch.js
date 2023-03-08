const db = require("../db");
const { UnauthorizedError } = require("../ErrorHandling/expressError");

let confirmMutualMatches = async function (userToView, appUser) {

  let allProjects = await db.query(
    `SELECT project_id
              FROM matches
              WHERE username =$1 OR username = $2`,
    [userToView, appUser]
  );

  // If there are two matching id's they have matched at least 1 matching project b/w each other.
  if (!allProjects.rows) throw new UnauthorizedError();
  let allProjIds = [...allProjects.rows.map(id => id.project_id)];
  // Create a set with all the id's IF they're the same length there are no mutual matches.
  let setOfIds = new Set(allProjIds)
  if (appUser == userToView || setOfIds.size !== allProjIds.length) {
    return true;
  } else {
    throw new UnauthorizedError();
  };
};

module.exports = confirmMutualMatches;

