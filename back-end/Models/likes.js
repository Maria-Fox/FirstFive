// may change this into something else- not tossing, yet!

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

    return newLike.rows[0];
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View user likes. AUTH REQUIRED. Returns liked_usernames.

  static async getUserLiked({liker_username}){

    let userLikedReq = await db.query(
      `SELECT liked_username
            FROM likes
            WHERE liker_username = $1`,
            [liker_username]
    );
    
    let userLiked = userLikedReq.rows;
    if(!userLiked) console.log("User has not liked any users.")
    return userLiked;
  };

    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View users who have liked username. AUTH REQUIRED. Returns liker_usernames.

  static async getUsersWhoLikedUser({username}){

    let usersWhoLikedUserReq = await db.query(
      `SELECT liker_username
            FROM likes
            WHERE liked_username = $1`,
            [username]
    );

    let usersWhoLikedUser = usersWhoLikedUserReq.rows;

    if(!usersWhoLikedUser) console.log("User has not been liked by others.")
    return usersWhoLikedUser;
  };
  // select liker usernamewhere liked_username = username



  
};

module.exports = Like;