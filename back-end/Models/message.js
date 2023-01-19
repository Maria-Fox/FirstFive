const db = require("../db");
const {ExpressError, NotFoundError, UnauthorizedError, BadRequestError} = require("../ErrorHandling/expressError");

class Message {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates new message. AUTH REQUIRED. Returns id, message_from, message_to, body, sent_at.

  static async createMessage(message_from, {message_to, body}) {
    // passing in the SQL native current_timestamp func for msg created at.
    const newMessage = await db.query(
        `INSERT INTO messages (
              message_from,
              message_to,
              body,
              sent_at)
          VALUES ($1, $2, $3, current_timestamp)
          RETURNING id, message_from, message_to, body, sent_at`,
        [message_from, message_to, body]);

    return newMessage.rows[0];
  };

    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View ALl messages. AUTH REQUIRED. Returns id, message_from, message_to.

  static async getAllMessages({username}){
    // something here
    let allUserMessagesResult = await db.query(
      `SELECT id,
              message_from, 
              message_to,
              body,
              sent_at,
              read_at
      FROM messages
      WHERE message_from = $1 OR message_to = $2`,
      [username, username]
    );

    let userMessages = allUserMessagesResult.rows;
    if(!userMessages) throw new ExpressError("No messages, yer!");

    return userMessages;
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // View individual message by id. AUTH REQUIRED. Returns id, message_from, message_to, body, sent_at.

  static async viewMessageID({message_id, username}){
    console.log(`Looking at msg w/ id ${message_id}`);

    const message = await db.query(
      `SELECT messages.id,
              messages.message_from AS message_from,
              f.bio AS from_bio,
              messages.message_to AS message_to,
              t.bio AS to_bio,
              messages.body,
              messages.sent_at,
              messages.read_at
      FROM messages 
      JOIN users AS f ON messages.message_from = f.username
      JOIN users AS t ON messages.message_to = t.username
      WHERE messages.id = $1`,
      [message_id]);

      let msgData = message.rows[0];
      // let message = messageSearchResult.rows[0];
      if(!msgData) throw new NotFoundError("No message found.", 404);

      // If the user is receing the message & opens it the read time is updated.
      let updatedReadTime;
      if(msgData.message_to === username){
        updatedReadTime = await this.markMessageRead(message_id);
      };

      // returning structured object w/ destructed message content
      let formattedMsg  = {
        "id": msgData.id,
        "from_user" : {
          "username" : msgData.message_from,
          "from_bio": msgData.from_bio
        },
        "to_user": {
          "username": msgData.message_to,
          "to_bio": msgData.to_bio
        },
        "body": msgData.body,
        "sent_at": msgData.sent_at,
        "read_at": msgData.read_at || updatedReadTime
      };

      return formattedMsg;
  }

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Mark message a read via id. AUTH REQUIRED. 

  static async markMessageRead(id){

    // using SQL timestamp function returns date time
    let messageReadResult = await db. query (
      `UPDATE messages
      SET read_at = current_timestamp
      WHERE id = $1
      RETURNING id, message_from, message_to, body, sent_at, read_at`,
      [id]
    );

    let updatedMessage = messageReadResult.rows[0];

    if(!updatedMessage) throw new NotFoundError("Message does not exist.", 404);
    return updatedMessage;
    };

    // closing class braket - do not delete
};

module.exports = Message;