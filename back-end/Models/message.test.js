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
    };

    let newMsg = await Message.createMessage(messageFrom, msgBody);

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

// Get all messages for {username}.***************************************** 
describe("View username messages", function () {
  test("View user with messages", async function (){
    let allMessages = await Message.getAllMessages({username: 'test3'});
    expect(allMessages[0].message_from).toEqual('test3');
    expect(allMessages[0].message_to).toEqual('test4');
    expect(allMessages[0].body).toEqual('This is from user 3 to user 4');

    expect(allMessages[1].message_from).toEqual('test4');
    expect(allMessages[1].message_to).toEqual('test3');
    expect(allMessages[1].body).toEqual('This is from user 4 to user 3');
});

test("User with no messages - returns error", async function (){
  try{
    let noMsgUser = await Message.getAllMessages({username: "test1"});
  } catch(e){
    expect(e instanceof ExpressError).toBeTruthy();
  };
});
});

// Get msg information from given msg id.***************************************** 
describe("View valid msg id details", function (){
  test("View valid id msg details", async function (){
    // middleware exists so only receiver or sender can view msg.
    let msgData = await Message.viewMessageID({message_id: messageIds[0]});

    expect(msgData.from_user.username).toEqual('test3');
    expect(msgData.from_user.from_bio).toEqual('Bio-3');
    expect(msgData.to_user.username).toEqual('test4');
    expect(msgData.to_user.to_bio).toEqual('Bio-4');

  });

  test("Invalid msgid returns error", async function (){
    try{
      let invalidMsg = await Message.viewMessageID({message_id: 500});
    } catch(e){
      expect(e instanceof NotFoundError).toBeTruthy();
    };
  })
});