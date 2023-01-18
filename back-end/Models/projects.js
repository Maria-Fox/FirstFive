const { resourceLimits } = require("worker_threads");
const db = require("../db");
const sqlForPartialUpdate = require("../HelperFunctions/SQLHelpers");
const {ExpressError, NotFoundError, UnauthorizedError, BadRequestError} = require("../ErrorHandling/expressError");

class Project {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Create a unique project. AUTH REQUIRED. Returns id, owner_username, name, project desc, timeframe.

  static async createProject({owner_username, name, project_desc, timeframe, github_repo}) {
    console.log("*****", github_repo)
  if(owner_username, name, project_desc, timeframe && github_repo) console.log(true);

    let newProjectRes = await db.query(
      `INSERT INTO projects(owner_username, name, project_desc, timeframe, github_repo)
      VALUES($1, $2, $3, $4, $5)
      RETURNING 
            id, 
            owner_username, 
            name, 
            project_desc, 
            timeframe,
            github_repo`, 
      [owner_username, name, project_desc, timeframe, github_repo]
    );

    let newProject = newProjectRes.rows[0];
    console.log(newProject, "***********")

    if(!newProject) throw new ExpressError("Project name already exists. lease update the name, or choose a new project to propose!");

    return newProject;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View all projects. AUTH REQUIRED. Returns id, owner_username, name, project_desc, and timeframe.

  static async viewAllProjects(){
    let projectResults = await db.query(
      `SELECT id,
              owner_username, 
              name,
              project_desc, 
              timeframe, 
              github_repo
      FROM projects
      ORDER BY name`
    );

    let allProjects = projectResults.rows;

    if(!projectResults) throw new ExpressError("There are no projects, yet! Propose a new project.");

    return allProjects;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View single project proposal. AUTH REQUIRED. Returns project id, owner_username, name, project_desc, timeframe.

  static async viewSingleProject({project_id}){
    console.log("VIEWING ***", project_id)

    let singleProjResult = await db.query(
      `SELECT id,
              owner_username, 
              name,
              project_desc, 
              timeframe,
              github_repo
      FROM projects 
      WHERE id = $1`,
      [project_id]
    );

    let singleProjData = singleProjResult.rows[0];

    if(!singleProjData) throw new NotFoundError("No such project exists.");
    return singleProjData;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Update single project proposal. AUTH REQUIRED. Returns updated request
  // owner_username, name, project_desc, timeframe.

  static async updateProject(project_id, reqData){

    // returns detrsuctured object where dbColumnsToUpdate holds parameterized queries. EX: dbColumnsToUpdate{project_desc = $1} 
    const {dbColumnsToUpdate, values } = sqlForPartialUpdate(reqData);

    let proj_id_Index = "$" + (values.length+1); 

    // build the sytntax popping in the columns to update & the owner_username index.
    let sqlSyntaxQuery = 
      `UPDATE projects
      SET ${dbColumnsToUpdate}
      WHERE id = ${proj_id_Index} 
      RETURNING 
        id, 
        owner_username, 
        name,
        project_desc, 
        timeframe, 
        github_repo`;

    // send off the db request to update adding in values & the actual co_username. Last to be added so it's the values.length+1
    let updatedProjResult = await db.query(sqlSyntaxQuery, [...values, project_id.project_id])

    let updatedProjData = updatedProjResult.rows[0];

    if(!updatedProjData) throw new NotFoundError(`Project request does not exist.`);
    return updatedProjData;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Delete single project proposal. AUTH REQUIRED. If invalid throws error, otherwise nothing is returned.

  static async delete(project_id, username){

    // Route also confirms the method is only accessed by project_owner.

    let deletionResult = await db.query(
      `DELETE 
      FROM projects
      WHERE id = $1 AND owner_username = $2
      RETURNING owner_username`,
      [project_id, username]
    );

    let deletionConfirmation = deletionResult.rows[0];

    if(!deletionConfirmation) throw new NotFoundError("Invalid delete request.");

    return deletionConfirmation
  };

  // class end bracket
};

module.exports = Project;

