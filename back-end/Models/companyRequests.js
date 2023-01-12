const { resourceLimits } = require("worker_threads");
const db = require("../db");
const {sqlForPartialUpdate} = require("../HelperFunctions/SQLHelpers");
// const {BadRequestError, NotFoundError, ExpressError} = require("../ErrorHandling")
const bcrypt = require("bcrypt");
const {BCRYPT_WORK_FACTOR} = require("../config");

class Company_request {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Create a companyRequest. AUTH REQUIRED. Returns co_username, project_desc, timeframe, searching_for_professional

  static async createRequest({co_username, project_desc, timeframe, searching_for_professional}) {

    let newRequestRes = await db.query(
      `INSERT INTO company_requests
      VALUES($1, $2 ,$3, $4)
      RETURNING co_username, project_desc, timeframe, searching_for_professional`, [
        co_username, project_desc, timeframe, searching_for_professional
      ]
    );

    let newRequest = newRequestRes.result.rows[0];

    // if(!newRequest) throw new ExpressError("Invalid inout. Please try again.")
    if(!newRequest) console.log("Error submitting request")

    return newRequest;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View all comapny requests. AUTH REQUIRED. Returns co_username, project_desc, timeframe, searching_for_professional for ALL requests.

  static async findAllRequests(){
    let companyRequestRes = await db.query(
      `SELECT co_username, 
              project_desc, 
              timeframe, 
              searching_for_professional
      FROM company_requests
      ORDER BY co_username`
    );

    let allRequests = companyRequestRes.result.rows;

    // if(!allRequests) throw new ExpressErro("Something went wrong- please try again.");

    if(!allRequests) console.log("Something went wrong- consoled");

    return allRequests;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View single company request. AUTH REQUIRED. Returns request
  // co_username, project_desc, timeframe, searching_for_professional

  static async viewSingleCoRequest({request_id}){

    // check join structure here

    let singleCoReq = await db.query(
      `SELECT co_username, 
              project_desc, 
              timeframe, 
              searching_for_professional
      FROM company_requests 
      WHERE request_id = $1`,
      [request_id]
    );

    let singleCoReqData = singleCoReq.results.row[0];

    // if(!companyReqResult) throw new NotFoundError("No such company exists.");
    if(!singleCoReqData) console.log("Invalid co. id");
    return singleCoReqData;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Update single company request. AUTH REQUIRED. Returns updated request
  // co_username, project_desc, timeframe, searching_for_professional

  static async updateCoRequest({request_id, reqData }){

    // returns detrsuctured object where dbColumnsToUpdate holds parameterized queries. EX: dbColumnsToUpdate{project_desc = $1} 
    const {dbColumnsToUpdate, values } = sqlForPartialUpdate(reqData, {
      project_desc: "project_desc",
      timeframe: "timeframe",
      searching_for_professional: "searching_for_professional",
    });

    let request_id_Index = "$" + (values.length+1); 

    // build the sytntax popping in the columns to update & the co_username index.
    let sqlSyntaxQuery = 
      `UPDATE company_requests
      SET ${dbColumnsToUpdate}
      WHERE request_id = ${request_id_Index}
      RETURNING 
        co_username AS co_username, 
        project_desc AS project_desc, 
        timeframe AS timeframe, 
        searching_for_professional AS searching_for_professional` 
    ;

    // send off the db request to update adding in values & the actual co_username. Last to be added so it's the values.length+1
    let updatedCompRequest = await db.query(sqlSyntaxQuery, [...values, request_id_Index])

    let updatedCompData = updatedCompRequest.result.rows[0];

    // if(!updatedCompRequest) throw new NotFoundError(`Company request does not exist.`);
    if(!updatedCompData) console.group("Logging- no co request w/ given id")
    return updatedCompData;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Delete single company request. AUTH REQUIRED. 

  static async deleteCoRequest({request_id}){

    let deleteRequest = await db.query(
      `DELETE 
      FROM company_requests
      WHERE request_id = $1
      RETURNING co_username`,
      [request_id]
    );

    let deletionConfirmation = deleteRequest.result.rows[0];
    // if(!deletionConfirmation) throw new ExpressError("Invalid delete request.")
    if(!deletionConfirmation) console.log("Should see ExpressError- fails to delete.")
  };

  // class end bracket
}

