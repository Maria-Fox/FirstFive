const db = require("../db");
const {ExpressError, NotFoundError, UnauthorizedError, BadRequestError} = require("../ErrorHandling/expressError");
const Message = require("./message");
const {commonnBeforeAll, commonBeforeEach, commonAfterEach, afterAllEnd, messageIds} = require("./forAllTests");

// Using the jest testing functions pass in the steps needed to open/close serv.
beforeAll(commonnBeforeAll); // add in test data
beforeEach(commonBeforeEach); //start db 
afterEach(commonAfterEach); // rollback the previous changes
afterAll(afterAllEnd); //close connection to db

// Create new msg..***************************************** 
describe("Create new message", function (){
  test("Successfully creates new msg", async function (){
    let messageFrom ='test2';
    let msgBody = {
      message_to: 'test1',
      body: "This is from user 1 to user 2.",
    }
    let newMsg = await Message.createMessage(messageFrom, msgBody);

    // console.log(newMsg);
    expect(newMsg.message_from).toEqual('test2');
    expect(newMsg.message_to).toEqual('test1');
    expect(newMsg.body).toEqual("This is from user 1 to user 2.");

    let dbCheck = await db.query(
      `SELECT * 
      FROM messages
      WHERE message_from = $1 AND message_to = $2`,
      ['test2', 'test1']
    );

    expect(dbCheck.rows.length).toEqual(1);
  });
});