const sqlForPartialUpdate = require("./SQLHelpers");

let updatedUserData = {
  "username": "updated_username",
  "email": "updated@email.com",
  "bio": "The UPDATED bio"
};

let updatedProjData = {
  "name" : "New proj name",
  "project_desc" : "To make a new proj",
  "timeframe": "2 days",
};

describe("Confirm correct column & value returns", function () {
  
  test("UserData is updated correctly.", function (){
  
    let result = sqlForPartialUpdate(updatedUserData);

    // exxpected return values. Escaping the double quotes.
    let updatedColumnsAndValues = {
      dbColumnsToUpdate: '"username"=$1, "email"=$2, "bio"=$3',
      values: [ 'updated_username', 'updated@email.com', 'The UPDATED bio' ]
    };

    expect(result).toEqual(updatedColumnsAndValues);
  });


  test("Project Data is updated correctly.", function () {
    let result = sqlForPartialUpdate(updatedProjData);

    let updatedColumnsAndValues = {
      dbColumnsToUpdate: '"name"=$1, "project_desc"=$2, "timeframe"=$3',
      values : ["New proj name", "To make a new proj", "2 days"]
    };

    expect(result).toEqual(updatedColumnsAndValues);
  })
});