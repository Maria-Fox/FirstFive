const db = require("../db");


class Professional_Like {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates new professional like. AUTH REQUIRED. Updates likes set to include the co_request_id.

  static async addLike({liker_username, liked_username}){

    // to avoid having duplicates should I change the fronend display / add a route break option? How can I get around this.
    let newLike = await db.query(
      `INSERT INTO likes (liker_username, liked_username)
            VALUES (liker_username = $1, liked_username = $2)
            RETURNING id, liker_username, liked_username`, 
      [liker_username, liked_username]
    );

    return newLike.result.rows[0];
  };

  // don't delete
};

module.exports = Professional_Like;