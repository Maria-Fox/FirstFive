const { resourceLimits } = require("worker_threads");
const db = require("../db");
const {sqlForPartialUpdate} = require("../HelperFunctions/SQLHelpers");
const {ExpressError, NotFoundError, UnauthorizedError, BadRequestError} = require("../ErrorHandling");

class Project {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Create a unique project. AUTH REQUIRED. Returns id, owner_username, name, project desc, timeframe.

  static async createProject({owner_username, name, project_desc, timeframe}) {

    let newProjectReq = await db.query(
      `INSERT INTO projects
      VALUES($1, $2 ,$3, $4)
      RETURNING id, owner_username, project_desc, timeframe`, 
      [owner_username, name, project_desc, timeframe]
    );

    let newRequest = newProjectReq.result.rows[0];

    if(!newRequest) throw new ExpressError("Project name already exists. lease update the name, or choose a new project to propose!");

    return newRequest;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View all projects. AUTH REQUIRED. Returns id, owner_username, name, project_desc, and timeframe.

  static async viewAllProjects(){
    let projectReq = await db.query(
      `SELECT id,
              owner_username, 
              name,
              project_desc, 
              timeframe, 
      FROM projects
      ORDER BY name`
    );

    let allProjects = projectReq.result.rows;

    if(!allRequests) throw new ExpressErro("There are no projects, yet! Propose a new project.");

    return allProjects;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View single project proposal. AUTH REQUIRED. Returns project id, owner_username, name, project_desc, timeframe.

  static async viewSingleProject({id}){

    // check join structure here

    let singleCoReq = await db.query(
      `SELECT id,
              owner_username, 
              name,
              project_desc, 
              timeframe, 
      FROM projects 
      WHERE id = $1`,
      [id]
    );

    let singleProjReq = singleCoReq.results.row[0];

    if(!singleProjReq) throw new NotFoundError("No such project exists.");
    return singleCoReqData;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Update single project proposal. AUTH REQUIRED. Returns updated request
  // owner_username, name, project_desc, timeframe.

  static async updateCoRequest({id, reqData }){

    // returns detrsuctured object where dbColumnsToUpdate holds parameterized queries. EX: dbColumnsToUpdate{project_desc = $1} 
    const {dbColumnsToUpdate, values } = sqlForPartialUpdate(reqData, {
      owner_username: "owner_username",
      name: "name",
      project_desc: "project_desc",
      timeframe: "timeframe",
    });

    let request_id_Index = "$" + (values.length+1); 

    // build the sytntax popping in the columns to update & the owner_username index.
    let sqlSyntaxQuery = 
      `UPDATE projects
      SET ${dbColumnsToUpdate}
      WHERE request_id = ${request_id_Index}
      RETURNING 
        owner_username AS owner_username, 
        name AS name,
        project_desc AS project_desc, 
        timeframe AS timeframe`
    ;

    // send off the db request to update adding in values & the actual co_username. Last to be added so it's the values.length+1
    let updatedProjRequest = await db.query(sqlSyntaxQuery, [...values, request_id_Index])

    let updatedProjData = updatedProjRequest.result.rows[0];

    if(!updatedProjData) throw new NotFoundError(`Project request does not exist.`);
    return updatedProjData;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Delete single project proposal. AUTH REQUIRED. If invalid throws error, otherwise nothing is returned.

  static async deleteProjRequest({username, id}){

    let deleteRequest = await db.query(
      `DELETE 
      FROM projects
      WHERE id = $1 AND owner_username = $2
      RETURNING owner_username`,
      [id, username]
    );

    let deletionConfirmation = deleteRequest.result.rows[0];
    if(!deletionConfirmation) throw new NotFoundError("Invalid delete request.");
  };

  // class end bracket
};

module.exports = Project;

