const db = require("../db");
const { NotFoundError, ExpressError, BadRequestError } = require("../ErrorHandling/ExpressError");
const Project = require("./project");

class Project_Member {


    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates project_member. Accessible to only the prject owner. Updates matches set to include project_id & username.

  static async addMember (project_id, {username}){

    let existingMember = await db.query(
      `SELECT username
      FROM project_members
      WHERE username = $1 AND project_id = $2`,
      [username, project_id.project_id]
    );

    if(existingMember.rows[0]) throw new ExpressError("User already including in project members!");

    let newMemberResult = await db.query(
      `INSERT INTO project_members (project_id, username) 
      VALUES ($1, $2)
      RETURNING id, project_id, username`,
      [project_id.project_id, username]
    );

    let newProjMember = newMemberResult.rows[0];
    return newProjMember;
  };


  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View all projec members. AUTH REQUIRED + must match project_id.

  static async viewAllMembers(project_id){

    let allMembersRes = await db.query(
      `SELECT users.username,
              users.bio
      FROM project_members
      JOIN users ON project_members.username = users.username
      WHERE project_id =$1`,
      [project_id.project_id]
    );

    let validMembers = allMembersRes.rows;
    if(!validMembers) throw new BadRequestError();
    
    let projetDataAndMembers = {
      // "proj_data": {...existingProject},
      "proj_members": {...validMembers}
    };

    return projetDataAndMembers;
  };

    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Deletes project_member. AUTH REQUIRED. Updates likes set to include the liked_username.

  static async deleteMember ({project_id}, {username}){

    let deleteMemberResult = await db.query(
      `DELETE 
      FROM project_members
      WHERE project_id = $1 AND username =$2
      RETURNING id, project_id, username`,
      [project_id, username]
    );

    let deletionConfirmation = deleteMemberResult.rows[0];
    if(!deletionConfirmation) return new NotFoundError(`Project or username do not exist. Unable to delete.`);
    return deletionConfirmation;
  };


// class end bracket
};

module.exports = Project_Member;