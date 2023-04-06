const e = require("cors");
const db = require("../db");
const { ExpressError, UnauthorizedError, BadRequestError, NotFoundError } = require("../ErrorHandling/expressError");


class Matches {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates new match. AUTH REQUIRED. Updates likes set to include the liked_username.

  static async addMatch({ project_id, username }) {

    let existingMatch = await db.query(
      `SELECT username
      FROM matches 
      WHERE username = $1 AND project_id = $2`,
      [username, project_id]
    );

    if (existingMatch.rows[0]) throw new BadRequestError();

    let newMatch = await db.query(
      `INSERT INTO matches (project_id, username)
        VALUES($1, $2)
        RETURNING id, project_id, username`,
      [project_id, username]
    );

    return newMatch.rows[0];
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View project current matches for username. AUTH REQUIRED. 

  // JOIN users on matches.username = users.username - IF YOU NEED TO JOIN USERS
  static async viewAllUserMatches({ username }) {

    let userMatches = await db.query(
      `SELECT m.project_id,
              projects.project_desc,
              projects.name,
              projects.owner_username,
              projects.timeframe,
              projects.github_repo
        FROM matches AS m
        JOIN projects on m.project_id = projects.id
        WHERE username = $1`,
      [username]
    );

    if (!userMatches.rows) throw new BadRequestError();

    return userMatches.rows;
  };


  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View all users who matched with the project_id. AUTH REQUIRED. Returns project_id, desc, name, owner_username, username (of  matchee), bio

  static async viewProjectUserMatches(project_id) {

    let existingProject = await db.query(
      `SELECT owner_username AS owner_username,
              name,
              project_desc,
              github_repo,
              timeframe
      FROM projects
      WHERE id = $1`,
      [project_id.project_id]
    );

    if (!existingProject.rows[0]) throw new NotFoundError();
    existingProject = existingProject.rows[0];

    let projectUserMatches = await db.query(
      `SELECT m.username AS user_matched,
              users.bio AS matched_user_bio
        FROM matches AS m
        JOIN projects on m.project_id = projects.id
        JOIN users on m.username =  users.username
        WHERE project_id = $1`,
      [project_id.project_id]
    );

    let allmatches = projectUserMatches.rows;

    if (!projectUserMatches.rows) throw new ExpressError("Project has no matches!");

    let matches = {
      "project_data": {
        "proj_owner": existingProject.owner_username,
        "proj_name": existingProject.name,
        "proj_desc": existingProject.project_desc,
        "github_repo": existingProject.github_repo,
        "timeframe": existingProject.timeframe
      },
      "user_matches": allmatches
    };

    // return projectUserMatches.rows;
    return matches;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Remove match for username. Returns error is unsuccessful, otherwise no return value.

  static async unmatchUser({ username, project_id }) {

    let unmatchResult = await db.query(
      `DELETE 
      FROM matches
      WHERE project_id = $1 AND username = $2
      RETURNING project_id`,
      [project_id, username]
    );

    let unmatchConfirmation = unmatchResult.rows[0];

    if (!unmatchConfirmation) throw new ExpressError("User is not matched with project.");
    return unmatchConfirmation;
  };


  // ************** USED IN MIDDLEARE **************
  //  // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

  // Confirm user sending request has matched with the project_id.

  static async confirmUserMatched(username, project_id) {

    let matchedUser = await db.query(
      `SELECT username,
              project_id
      FROM matches
      WHERE username = $1 AND project_id =$2`,
      [username, project_id]
    );

    let confirmedMatch = matchedUser.rows[0];

    if (!confirmedMatch) {
      throw new UnauthorizedError();
    };

    return confirmedMatch;
  };


  // class closing bracket
};



module.exports = Matches;
