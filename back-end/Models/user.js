const db = require("../db");
const bcrypt = require("bcrypt");
const {BCRYPT_WORK_FACTOR} = require("../config");
const {sqlForPartialUpdate} = require("../HelperFunctions/SQLHelpers")
// const {BadRequestError, NotFoundError, ExpressError} = require("../ErrorHandling")

class User {
  // Primary key of username. Uses parameterized queries to prevent SQL injection.


  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates new user. NO AUTH REQUIRED. Returns newUser or BadRequestError if existing user has the given username.

  static async register({username, password, contact_num, contact_email, type_of_user, bio}){

    // check whether username already exists
    let existingUserCheck = await db.query(
      `SELECT username 
      FROM users
      WHERE username = $1`, [username]
      );

      // If there is a row returned user exists. Send user error.
      if(existingUserCheck.rows[0]){
        // throw new BadRequestError("Username already exists. Please choose a new username.")
        console.log("Username already exists. Choose a new one.")
      };

      let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

      // if there is no existing user row create a new user w/ info passed in & HASHED PW.
      let newUserResult = await db.query(
        `INSERT INTO users 
        (username, password, contact_num, contact_email, type_of_user, bio)
        VALUES($1, $2, $3, $4, $5, $6) 
        RETURNING username, password, contact_num, contact_email, type_of_user, bio`, 
        [username, hashedPassword, contact_num, contact_email, type_of_user, bio ] 
      );

      const newUser = newUserResult.rows[0];
      return newUser;
  };

   // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Authenticate given username & password against db. NO AUTH REQUIRED. Returns error if input does not match db information.

  static async authenticateUser({username, givenPassword}){

    // confirm there is a user w/ given username first

    let userConfirmation = await db.query(
      `SELECT username
      FROM users
      WHERE username = $1`, [username]
    );

    let user = userConfirmation.rows[0];

    if(user){
      // if there is a user compare the given pw against the hashed pw stored in the user.database
      let passwordMatch = await bcrypt.compare(givenPassword, user.password);

      if(passwordMatch === true){
      // remove hashed password and return the user info.
        delete user.password;
        return user;
      }
    }

    console.log("Incorrect username or password")
    // throw new BadRequestError("Incorrect username or password.")
  }

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Find ALL users. AUTH REQUIRED. Returns user's: username, contact_num, contact_email, type_of_user, bio.

  static async findAllUsers(){

      let allUsersResult = await db.query(
        `SELECT username, contact_num, contact_email, type_of_user, bio
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
      `SELECT username
      FROM users 
      WHERE username = $1 
      RETURNING username, contact_num, contact_email, type_of_user, bio`, [username]
    );

    let validUser = foundUser.rows[0]

    if(validUser){

      // MAYBE SEE IF YOU WANT TO DISPLAY LIKES?
      return validUser;


      
    } else {
      console.log("No user error")
      // throw new NotFoundError(`${username} does not exist. Please update your search.`)
    }
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Update user details pased on submission. AUTH REQUIRED. Returns user's: username, contact_num, contact_email, type_of_user, bio.

  // data = req.body
  static async updateUserProfile(username, reqData){
    // validate the password matches the db pw to submit changes.
    if(data.password){
      // re-assign the data.password to the hashed version for comparison
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    } else {
      throw new ExpressError("Password incorrect. Please resubmit with valid password.")
    };

    // destructures return object. Ex: 
    // { dbColumnsToUpdate: '"username"=$1, "contact_num"=$2',
    // values: ["SoftwareDevUser1", "9165286431"] }
    const {dbColumnsToUpdate, values } = sqlForPartialUpdate(reqData, {
      username: "username",
      contact_num: "contact_num",
      contact_email: "contact_email",
      type_of_user: "type_of_user",
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
                      contact_num AS "contact_num",
                      contact_email AS "contact_email",
                      type_of_user AS "type_of_user",
                      bio AS "bio"
                  `;

    let updateResult = await db.query(sqlSyntaxQuery, [...values, username]);
    let user = updateResult.rows[0];

    // if(!user) throw new NotFoundError(`No user found. Please check your spelling and try again.`)
    console.log("No user was found line 165.")

    delete user.password;
    return user;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Delete account. AUTH REQUIRED. Deletes user if the username + password are valid. Otherwise throws BadRequestError notifying user to check spelling and try again.

  static async deleteUser(username, password){
    let authUser = await this.authenticateUser(username, password);

    // if we get a user back we can send off the db deletion request.
    if(authUser){
      let deleteRequest = await db.query(
        `DELETE 
        FROM users
        WHERE username = $1
        RETURNING username`, 
        [username]
      );

      let deletedUserConfirmation = deleteRequest.result.rows[0];

      // if(!deletedUserConfirmation) throw new ExpressError("Invalid username or password. Please check your spelling and try again.")

      console.log("Password or username invalid. Line 192.")

    }
  }

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Like a companyRequest. AUTH REQUIRED. 

  // static async likeCompanyRequest()

}