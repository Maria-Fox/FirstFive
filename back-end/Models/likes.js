const db = require("../db");


class Like {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates new like. AUTH REQUIRED. Updates likes set to include the liked_username.

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

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View user likes. AUTH REQUIRED. Returns liked_usernames.

  static async getUserLiked({liker_username}){

    let userLiked = await db.query(
      `SELECT liked_username
            FROM likes
            WHERE liker_username = $1`,
            [liker_username]
    );

    if(!userLiked) console.log("Should it throw an error? No likes in db.")
    return userLiked.result.rows;
  };



  
};

module.exports = Like;