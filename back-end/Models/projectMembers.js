const db = require("../db");

class Project_Member {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates project_member. AUTH REQUIRED. Updates likes set to include the liked_username.

  static async addMember ({project_id, username}){

    let newMemberReq = await db.query(
      `INSERT INTO project_members (project_id, username) 
      VALUES project_id = $1, username =$2
      RETURNING id, project_id, username`,
      [project_id, username]
    );

    return newProjMember = newMemberReq.result.rows[0];
  };



}