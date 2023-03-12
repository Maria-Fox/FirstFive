"use strict";
// Confirms the correct db_url is returned based on the assigned NODE_ENV.

describe("DB config assigned by process.env", function (){
  test("Correct configuration", async function () {
    process.env.SECRET_KEY = "test_key";
    process.env.PORT = "5000";
    process.env.DATABASE_URL = "test_db_url",
    process.env.NODE_ENV = "testing_env";

    const config = require("./config");
    expect(config.SECRET_KEY).toEqual("test_key");
    expect(config.PORT).toEqual(5000);
    // based on node_env we will get the appropriate database_url
    expect(config.getApproporiateDBURI()).toEqual("test_db_url");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(12);

    // reset to empty/default env assignements
    delete process.env.SECRET_KEY;
    delete process.env.PORT;
    delete process.env.BCRYPT_WORK_FACTOR;
    delete process.env.DATABASE_URL;

    expect(config.getApproporiateDBURI()).toEqual("firstfive");
    process.env.NODE_ENV = "test";
    expect(config.getApproporiateDBURI()).toEqual("firstfive_test");
  })
})