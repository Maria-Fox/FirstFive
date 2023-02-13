// const { resourceLimits } = require("worker_threads");
const db = require("../db");
const sqlForPartialUpdate = require("../HelperFunctions/SQLHelpers");
const { ExpressError, NotFoundError, UnauthorizedError, BadRequestError } = require("../ErrorHandling/expressError");
const RandomItemFromNonMatchedIds = require("../HelperFunctions/RandomItemFromNonMatchedIds")


class Project {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Create a unique project. AUTH REQUIRED. Returns id, owner_username, name, project desc, timeframe.

  static async createProject({ owner_username, name, project_desc, timeframe, github_repo }) {

    let existingProjName = await db.query(
      `SELECT * 
      FROM projects 
      WHERE name= $1`,
      [name]
    );

    if (existingProjName.rows[0]) throw new ExpressError("Project name must be unique. Please choose a new name or project.");

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

    // user who creates the project is instantly matched to the project for furthher requests.

    let userMatchedToProj = await db.query(
      `INSERT INTO matches (project_id, username)
      VALUES($1, $2)
      RETURNING id, project_id, username`,
      [newProject.id, owner_username]
    );

    // console.log(newProject, "***********", "matched", userMatchedToProj)

    return newProject;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View all projects. AUTH REQUIRED. Returns id, owner_username, name, project_desc, and timeframe.

  static async viewAllProjects() {
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

    if (!projectResults) throw new ExpressError("There are no projects, yet! Propose a new project.");

    return allProjects;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View single project proposal. AUTH REQUIRED. Returns project id, owner_username, name, project_desc, timeframe.

  static async viewSingleProject({ project_id }) {
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

    if (!singleProjData) throw new NotFoundError("Project does not exist.");
    return singleProjData;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View projects created by user. AUTH REQUIRED. Returns id, owner_username, name, project_desc, timeframe, github_repo.

  static async viewCreatedProjsByUser(username) {
    let projectResults = await db.query(
      `SELECT id,
                owner_username, 
                name,
                project_desc, 
                timeframe, 
                github_repo
        FROM projects
        WHERE owner_username = $1
        ORDER BY name`,
      [username]);

    let allProjects = projectResults.rows;
    return allProjects;
  };


  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Update single project proposal. AUTH REQUIRED. Returns updated request
  // owner_username, name, project_desc, timeframe.

  static async updateProject(project_id, reqData) {

    // See if project name already exists.IF so, notify user to pick a new name.

    // let existingProjName = await db.query(`
    //     SELECT name 
    //     FROM projects
    //     WHERE name = $1`,
    //   [reqData.name]);

    // if (existingProjName.rows[0]) throw new BadRequestError("Existing project name. Please choose a new name.");

    // returns detrsuctured object where dbColumnsToUpdate holds parameterized queries. EX: dbColumnsToUpdate{project_desc = $1} 
    const { dbColumnsToUpdate, values } = sqlForPartialUpdate(reqData);

    let proj_id_Index = "$" + (values.length + 1);

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
    let updatedProjResult = await db.query(sqlSyntaxQuery, [...values, project_id.project_id]);

    console.log("@#$%(*%^", updatedProjResult.rows);

    let updatedProjData = updatedProjResult.rows[0];

    if (!updatedProjData) throw new NotFoundError(`Project request does not exist.`);
    return updatedProjData;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Delete single project proposal. AUTH REQUIRED. If invalid throws error, otherwise nothing is returned.

  static async delete(project_id, username) {

    // Route also confirms the method is only accessed by project_owner.

    let deletionResult = await db.query(
      `DELETE 
      FROM projects
      WHERE id = $1 AND owner_username = $2
      RETURNING owner_username`,
      [project_id, username]
    );

    let deletionConfirmation = deletionResult.rows[0];

    if (!deletionConfirmation) throw new NotFoundError("Invalid delete request.");

    return deletionConfirmation
  };

  // Have not completed testing. Would like additional filters like owner_username, or github_repo
  static async projectSearch({ project_name }) {
    let projectData = await db.query(
      `SELECT owner_username, name, project_desc, timeframe, github_repo
      FROM projects
      WHERE name =$1`,
      [project_name]
    );

    if (!projectData.rows[0]) throw new NotFoundError();
    return projectData.rows[0];
  };

  // Change projects displayed as of 1/29 ********************************

  static async viewNonMatchedProjs(username) {
    let matchedProjIds = await db.query(
      `SELECT project_id
      FROM matches
      Where username = $1`,
      [username]
    );

    console.log(matchedProjIds.rows.map(proj => proj.project_id), "********");

    let avoidIds = matchedProjIds.rows.map(match => match.project_id) || "";
    // need to remove from array
    avoidIds = `(${avoidIds})`;
    console.log(`${avoidIds}`);

    let projectResults = await db.query(
      `SELECT id,
              owner_username, 
              name,
              project_desc, 
              timeframe, 
              github_repo
      FROM projects
      WHERE id NOT IN ${avoidIds}
      ORDER BY name`);


    let allProjects = projectResults.rows;

    if (!projectResults) throw new ExpressError("There are no projects, yet! Propose a new project.");

    return allProjects;
  };

  // Carousel Display of 2/9 ********************************

  static async carouselProjects(username) {


    // Grab the existing project id's the user has already matched 
    let matchedProjIds = await db.query(
      `SELECT project_id
      FROM matches
      Where username = $1`,
      [username]
    );

    // ***** If the USER HAS NO MATCHING PROJECTS ....
    if (matchedProjIds.rows.length == 0) {

      // Grab all the existing project ids.
      let projectIds = await db.query(
        `SELECT id 
        FROM projects`
      );

      projectIds = projectIds.rows.map(proj => proj.id)

      // Shuffle the array, grab a random project. Send db request. Return {} with data.
      let itemToDisplay = RandomItemFromNonMatchedIds(projectIds);

      let project_data = await db.query(
        `SELECT id,
                owner_username,
                name,
                project_desc,
                timeframe,
                github_repo
          FROM projects where id = $1`,
        [itemToDisplay]
      );

      return [project_data.rows[0]];
    };


    // *****If user HAS EXISTING MATCHES proceed with below.


    // Grab all the ids user HAS matched with.
    let avoidIds = matchedProjIds.rows.map(match => match.project_id) || "";
    // need to remove from array

    avoidIds = `(${avoidIds})`;
    // console.log(` avoid these ids : ${avoidIds}`);

    // Grab all ids user has NOT matched with.
    let arrayOfProjectsToMatch = await db.query(
      `SELECT id
      FROM projects
      WHERE id NOT IN ${avoidIds}`
    );

    arrayOfProjectsToMatch = arrayOfProjectsToMatch.rows.map(proj => proj.id);

    // If there's nothing returned user matched all projects.
    if (arrayOfProjectsToMatch.length == 0) throw BadRequestError("You have matched all projects!")

    let itemToDisplay = RandomItemFromNonMatchedIds(arrayOfProjectsToMatch);
    console.log(itemToDisplay, "DISPLAY THIS")

    let randomProjData = await db.query(
      `SELECT id,
              owner_username,
              name,
              project_desc,
              timeframe,
              github_repo
        FROM projects 
        WHERE id = $1`,
      [itemToDisplay]
    );

    console.log(randomProjData.rows)
    return [randomProjData.rows[0]];
  };


  // class end bracket
};

module.exports = Project;

