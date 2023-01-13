const db = require("../db");


class Matches {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates new match. AUTH REQUIRED. Updates likes set to include the liked_username.

  static async addMatch({project_id, username}){

    let newMatch = await db.query(
      `INSERT INTO matches (project_id, username)
            VALUES (project_id = $1, username = $2)
            RETURNING id, project_id, username`, 
      [project_id, username]
    );

    return newMatch.result.rows[0];
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View current matches for username. AUTH REQUIRED. Updates match set to include the project_id.

  // JOIN users on matches.username = users.username - IF YOU NEED TO JOIN USERS


  static async viewAllUserMatches({username}){

    let userMatches = await db.query(
      `SELECT m.project_id,
              projects.project_desc,
              projects.name,
              projects.owner_username
        FROM matches AS m
        JOIN projects on m.project_id = projects.id
        WHERE username = $1`, 
        [username]
    );

    // if(!userMatches.result.rows) throw new ExpressError("You have no matches!");
    if(!userMatches.result.rows) console.log("There are no matches.")

    return userMatches.result.rows;
  };


  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View all users who matched with the prohect proposal. AUTH REQUIRED. Returns project_id, desc, name, owner_username, username (of  matchee), bio

  static async viewProjectUserMatches({project_id}){

    let projectUserMatches = await db.query(
      `SELECT m.project_id,
              projects.project_desc,
              projects.name,
              projects.owner_username,
              users.username,
              users.bio
        FROM matches AS m
        JOIN projects on m.project_id = projects.id
        JOIN users on m.username =  users.username
        WHERE project_id = $1`, 
        [project_id]
    );

    // if(!projectUserMatches.result.rows) throw new ExpressError("You have no matches!");
    if(!projectUserMatches.result.rows) console.log("There are no matches.")

    return projectUserMatches.result.rows;
  };

}
