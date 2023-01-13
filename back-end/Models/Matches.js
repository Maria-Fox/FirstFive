const db = require("../db");


class Matches {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates new like. AUTH REQUIRED. Updates likes set to include the liked_username.

  static async addMatch({project_id, username}){

    // to avoid having duplicates should I change the fronend display / add a route break option? How can I get around this.
    let newLike = await db.query(
      `INSERT INTO matches (project_id, username)
            VALUES (project_id = $1, username = $2)
            RETURNING id, liker_username, liked_username`, 
      [liker_username, liked_username]
    );

    return newLike.result.rows[0];
  };

  static async searchMatch({project_id, username}){

    // to avoid having duplicates should I change the fronend display / add a route break option? How can I get around this.
    let newLike = await db.query(
      `SELECT m.project_id,
              projects.project_desc
        FROM matches AS m
        JOIN projects on matches.project_id = projects.id
        JOIN users on matches.username = users.useername
    );

    return newLike.result.rows[0];
  };

}
