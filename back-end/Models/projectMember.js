const db = require("../db");
const { NotFoundError } = require("../ErrorHandling/ExpressError");

class Project_Member {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates project_member. AUTH REQUIRED. Updates matches set to include project_id & username.

  static async addMember ({project_id, username}){

    let newMemberResult = await db.query(
      `INSERT INTO project_members (project_id, username) 
      VALUES ($1, $2)
      RETURNING id, project_id, username`,
      [project_id, username]
    );

    return newProjMember = newMemberResult.rows[0];
  };

    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Deletes project_member. AUTH REQUIRED. Updates likes set to include the liked_username.

  static async deleteMember ({project_id, username}){

    let deleteMemberResult = await db.query(
      `DELETE 
      FROM prroject_members
      WHERE project_id = $1 AND username =$2
      RETURNING id, project_id, username`,
      [project_id, username]
    );

    let deletionConfirmation = deleteMemberResult.rows[0];
    if(!deletionConfirmation) return new NotFoundError(`Project or username do not exist. Unable to delte.`)
  };



}