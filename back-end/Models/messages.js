const db = require("../db");
const {ExpressError, NotFoundError, UnauthorizedError, BadRequestError} = require("../ErrorHandling");

class Message {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates new message. AUTH REQUIRED. Returns id, message_from, message_to, body, sent_at.

  static async createMessage({message_from, message_to, body}) {
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

  static async viewMessageID({id}){

    const messageSearchResult = await db.query(
      `SELECT message_from,
              message_to,
              body,
              sent_at,
              read_at
        FROM messages
        WHERE id = $1`,
        [id]
    );
      // `SELECT m.id,
      //         m.message_from,
      //         f.username AS message_from,
      //         f.email AS from_email,
      //         f.  AS from_ 
      //         m.message_to,
      //         t.username AS message_to,
      //         t.email AS to_email,
      //         t.  AS to_ ,
      //         m.body,
      //         m.sent_at,
      //         m.read_at
      //   FROM messages AS m
      //     JOIN users AS f ON m.message_from = f.username
      //     JOIN users AS t ON m.message_to = t.username
      //   WHERE m.id = $1`,
      // [id]);

      // unsure if I even need to join. Look into this...
      // SELECT (message_from, message_to, body, sent_at) FROM messages WHERE id = 1;

      let message = messageSearchResult.rows[0];
      if(!message) throw new NotFoundError("Message does not exist.", 404)

      // returning structured object w/ destructed message content
      // return {
      //   id: message.id,
      //   from_user : {
      //     username : message.message_from,
      //     email: message.from_email,
      //      : message.from_ 
      //   },
      //   to_user: {
      //     username: message.message_to,
      //     email: message.to_message_email,
      //      : message.to_ 
      //   },
      //   body: message.body,
      //   sent_at: message.sent_at,
      //   read_at: message.read_at
      // }
      return message;
  }

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Mark message a read via id. AUTH REQUIRED.

  static async markMessageRead({id}){

    // using SQL timestamp function returns date time
    let messageReadResult = await db. query (
      `UPDATE messages
      SET read_at = $1
      WHERE id = $2
      RETURNING id, message_from, message_to, body, sent_at, read_at`,
      [current_timestamp, id]
    );

    let updatedMessage = messageReadResult.rows[0];

    if(!updatedMessage) throw new NotFoundError("Message does not exist.", 404);
    return updatedMessage;

    };

    // closing class braket - do not delete
};

module.exports = Message;