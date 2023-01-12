const db = require("../db");


class Message {

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Creates new message. AUTH REQUIRED. Returns id, message_from, message_to, body, sent_at.

  static async createMessage({from_username, to_username, body}) {
    const newMessage = await db.query(
        `INSERT INTO messages (
              message_from,
              message_to,
              body,
              sent_at)
            VALUES ($1, $2, $3, current_timestamp)
            RETURNING id, message_from, message_to, body, sent_at`,
        [from_username, to_username, body]);

    return newMessage.result.rows[0];
  };

  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

  // Mark given message read.. AUTH REQUIRED. Returns id, message_from, message_to, body, sent_at.

  static async markMessageRead({id}){

    const result = await db.query(
      `SELECT m.id,
              m.message_from,
              f.username AS from_username,
              f.contact_email AS from_contact_email,
              f.contact_num AS from_contact_num
              m.message_to,
              t.username AS to_username,
              t.contact_email AS tocontact_email,
              t.contact_num AS to_contact_num,
              m.body,
              m.sent_at,
              m.read_at
        FROM messages AS m
          JOIN users AS f ON m.message_from = f.username
          JOIN users AS t ON m.message_to = t.username
        WHERE m.id = $1`,
      [id]);

  }



}