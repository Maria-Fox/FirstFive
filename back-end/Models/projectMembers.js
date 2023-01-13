const db = require("../db");

class Project_Member {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates project_member. AUTH REQUIRED. Updates matches set to include project_id & username.

  static async addMember ({project_id, username}){

    let newMemberReq = await db.query(
      `INSERT INTO project_members (project_id, username) 
      VALUES project_id = $1, username =$2
      RETURNING id, project_id, username`,
      [project_id, username]
    );

    return newProjMember = newMemberReq.result.rows[0];
  };

    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Deletes project_member. AUTH REQUIRED. Updates likes set to include the liked_username.

  static async deleteMember ({project_id, username}){

    let deleteMemberReq = await db.query(
      `DELETE 
      FROM prroject_members
      WHERE project_id = $1 AND username =$2
      RETURNING id, project_id, username`,
      [project_id, username]
    );

    let deletionConfirmation = deleteMemberReq.result.rows[0];
    if(!deletionConfirmation) return new ExpressError(`Porject or username do not exist. Unable to delte.`)
  };



}