const db = require("../db");
const { NotFoundError, ExpressError, BadRequestError } = require("../ErrorHandling/expressError");
const Project_Member = require("./projectMember");
const { commonnBeforeAll, commonBeforeEach, commonAfterEach, afterAllEnd, projectIds } = require("./forAllTests");

// Using the jest testing functions pass in the steps needed to open/close serv.
beforeAll(commonnBeforeAll); // add in test data
beforeEach(commonBeforeEach); //start db 
afterEach(commonAfterEach); // rollback the previous changes
afterAll(afterAllEnd); //close connection to db

//  Middleware used for methods to ensures proj_owner is the user sending req. 
// Otherwise, method is not accessible.

// Add project member***************************************** 
// Middleware exists to ensure only project_owners can access method.

describe("Add project member", function () {
  test("Add project member - project_owner", async function () {
    let project = { "project_id": projectIds[0] }
    let newProjMember = await Project_Member.addMember(project, { username: "test2" });

    expect(newProjMember.username).toEqual("test2");
    expect(newProjMember.project_id).toEqual(projectIds[0]);

    let dbCheck = await db.query(
      `SELECT *
      FROM project_members
      WHERE project_id = $1 AND username = $2`,
      [projectIds[0], 'test2']
    );

    expect(dbCheck.rows[0].username).toEqual("test2");
    expect(dbCheck.rows[0].project_id).toEqual(projectIds[0]);
  });

  test("Deny duplicate member", async function () {
    try {
      let newProjMember = await Project_Member.addMember({ "project_id": projectIds[0] }, { username: "test2" });

      let duplicateMember = await Project_Member.addMember({ "project_id": projectIds[0] }, { username: "test2" });

    } catch (e) {
      expect(e instanceof ExpressError).toBeTruthy();
    };
  });
});

// View all members. Middleware exists t***************************************** 
// middleware exists to check for invalid id returning an error.

describe("View all project members", function () {
  test("Valid project id returns all project members", async function () {
    let allProjUsers = await Project_Member.viewAllMembers({ "project_id": projectIds[0] });

    expect(allProjUsers).toEqual([
      { username: 'test4', bio: 'Bio-4' },
      { username: 'test3', bio: 'Bio-3' }
    ]);
  });

  test("Valid project id with zero matching users", async function () {
    try {
      let noMemberProject = await Project_Member.viewAllMembers({ project_id: projectIds[4] });
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  })
});

// Delete project member.***************************************** 
// middleware exists to redirect non project owners. They cannot access method.

describe("Allow project_owner to delete given project", function () {
  test("Valid user deleting project", async function () {
    let deletedUser = await Project_Member.deleteMember({ "project_id": projectIds[1] }, { "username": "test4" });

    expect(deletedUser.username).toEqual("test4");

    let dbCheck = await db.query(
      `SELECT id, username
      FROM project_members
      WHERE project_id = $1 AND username = $2`,
      [projectIds[1], 'test4']
    );

    expect(dbCheck.rows.length).toEqual(0);
  });

  test("Invalid project id", async function () {
    try {
      let invalidReq = await Project_Member.deleteMember({ "username": "test1" }, { "project_id": projectIds[3] })
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    };
  });


});
