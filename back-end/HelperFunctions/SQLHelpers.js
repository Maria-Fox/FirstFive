// const {BadRequestError} = require("../ErrorHandling");

// dataToUpdate is an obj. (req.body )
// jsToSql : object, specify which items to update to SQL. Already in JS format.
function sqlForPartialUpdate(dataToUpdate, jsToSql) {

  // We're grabbing the keys (from req.body) and assigning to variable "keys". Returns an array of keys.
  // console.log(dataToUpdate);
  const keys = Object.keys(dataToUpdate);

  // If there are no keys we return user error. BadRequest
  if (keys.length === 0) throw new Error("No data");

  // here, we loop through the keys array. Grabbing the ColName (column name) key and attach the corresponding index value for a parameterized query (to prevent SQL injections).
  // Retuns an Array with a sentence "key" = "value" EX:
  // {username: 'Aliya'} => ['"username"=$1']

  const columnsToUpdate = keys.map((colName, idx) =>
      // param. queries are one-indexed so we add one at the start.
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  // returns a single obj with two keys {setCols, dataToUpdate}. Set Cols: every column needing an update (and varaible index). Values, corresponding values to column edit.
//  @example {username: "SoftwareDevUser1",  : "9165286431"} =>
//  *   { dbColumnsToUpdate: '"username"=$1,  =$2',
//  *     values: ["SoftwareDevUser1", "9165286431"] }

// readies the arameterized query syntax
  return {
    dbColumnsToUpdate: columnsToUpdate.join(", "),
    values: Object.values(dataToUpdate),
  };
};

module.exports = sqlForPartialUpdate;