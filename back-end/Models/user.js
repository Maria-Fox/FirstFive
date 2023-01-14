const db = require("../db");
const bcrypt = require("bcrypt");
const {BCRYPT_WORK_FACTOR} = require("../config");
const {sqlForPartialUpdate} = require("../HelperFunctions/SQLHelpers");
const {ExpressError, NotFoundError, BadRequestError} = require("../ErrorHandling/expressError");

class User {
  // Primary key of username. Uses parameterized queries to prevent SQL injection.

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates new user. NO AUTH REQUIRED. Returns newUser or BadRequestError if existing user has the given username.

  static async register({username, password, email, bio}){

    // check whether username already exists in db.
    let existingUserCheck = await db.query(
      `SELECT username 
      FROM users
      WHERE username = $1`, [username]
      );

      // If there is a row returned user exists. Send user error.
      if(existingUserCheck.rows[0]){
        throw new BadRequestError("Username already exists. Please choose a new username.");
      };

      let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

      // if there is no existing user create a new user w/ info passed in & HASHED PW (not the original unhashed pw).
      let newUserResult = await db.query(
        `INSERT INTO users 
        (username, password, email, bio)
        VALUES($1, $2, $3, $4) 
        RETURNING username, password, email, bio`, 
        [username, hashedPassword, email, bio]
      );

      const newUserData = newUserResult.rows[0];
      return newUserData;
  };

   // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Authenticate given username & password against db. NO AUTH REQUIRED. Returns error if input does not match db information.

  static async authenticateUser({username, password}){

    // confirm there is a user w/ given username first
    let usernameExists = await db.query(
      `SELECT username,
              password
      FROM users
      WHERE username = $1`, [username]
    );

    let user = usernameExists.rows[0];

    if(user){
      // if there is a user compare the given pw against the hashed pw stored in the user.database
      let passwordMatch = await bcrypt.compare(password, user.password);

      if(passwordMatch === true){
      // remove hashed password and return the user info.
      delete user.password;
      return user;
      };
    };
    throw new BadRequestError("Incorrect username or password.");
  }

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Find ALL users. AUTH REQUIRED. Returns user's: username, email, bio.

  static async findAllUsers(){

      let allUsersResult = await db.query(
        `SELECT username, email, bio
        FROM users 
        ORDER BY username`
      );

      let allUsers = allUsersResult.rows;
      
      return allUsers;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Find user based on username. AUTH REQUIRED. Returns user details or no user found Error.

  static async findUser({username}){

    let foundUser = await db.query(
      `SELECT username,
              bio
      FROM users 
      WHERE username = $1`,
      [username]
    );

    let validUser = foundUser.rows[0]

    if(validUser){

      // MAYBE SEE IF YOU WANT TO DISPLAY LIKES?
      return validUser;

    } else {
      throw new NotFoundError(`${username} does not exist. Please update your search.`);
    }
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Update user details pased on submission. AUTH REQUIRED. Returns user's: username, email, bio.

  // data = req.body
  static async updateUserProfile(username, reqData){
    // re-assign the reqData.password to the hashed version for storing
    if(reqData.password){
      reqData.password = await bcrypt.hash(reqData.password, BCRYPT_WORK_FACTOR);
    };

    // destructures return object. Ex: 
    // { dbColumnsToUpdate: '"username"=$1,  =$2',
    // values: ["SoftwareDevUser1", "9165286431"] }
    const {dbColumnsToUpdate, values } = sqlForPartialUpdate(reqData, {
      username: "username",
      password: "password",
      email: "email",
      bio: "bio"
    });

    // should the user not update the username we still need to submit a query w/ variable input. Adding one since it's an additional param.
    const usernameVarIndex = "$"+(values.length +1);

    let sqlSyntaxQuery = `
                  UPDATE users
                  SET ${dbColumnsToUpdate} 
                  WHERE username = ${usernameVarIndex}
                  RETURNING 
                      username AS "username",
                      email AS "email",
                      bio AS "bio"`;

    let updateResult = await db.query(sqlSyntaxQuery, [...values, username]);
    let user = updateResult.rows[0];

    if(!user) throw new NotFoundError(`No user found. Please check your spelling and try again.`);

    delete user.password;
    return user;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Delete account. AUTH REQUIRED. Deletes user if the username + password are valid. Otherwise throws BadRequestError notifying user to check spelling and try again.

  static async deleteUser(username, password){

      let deleteRequest = await db.query(
        `DELETE 
        FROM users
        WHERE username = $1 AND password = $2
        RETURNING username`, 
        [username, password]
      );

      let deletedUserConfirmation = deleteRequest.rows[0];

      if(!deletedUserConfirmation) throw new ExpressError("Invalid username or password. Please check your spelling and try again.")
      // nothing is returned. The route redirects to login pg.
  };
};

module.exports = User;