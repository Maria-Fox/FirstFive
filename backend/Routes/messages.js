const router = require("express").Router();
const Message = require("../Models/message");
const { ensureLoggedIn, ensureAuthUser } = require("../Middleware/auth");
const jsonschema = require("jsonschema");
const newMsgSchema = require("../Schemas/newMessage.json");
const { BadRequestError } = require("../ErrorHandling/expressError");

// All routes prefixed with "/messages." All require auth and project match.

// Create new msg. **Requires users to have matching project_id's**
// auth user/ logged in & matches proj
router.post("/:username/create", ensureLoggedIn, ensureAuthUser,
  async function (req, res, next) {
    try {
      let validFieldInput = jsonschema.validate(req.body, newMsgSchema);

      if (!validFieldInput.valid) {
        let fieldErrors = validFieldInput.errors.map(e => e.stack);
        throw new BadRequestError(fieldErrors);
      };
      // message from is always the signed in user, req body has msg.to and body
      let newMessage = await Message.createMessage(req.params.username, req.body);
      return res.status(201).json(newMessage);
    } catch (e) {
      return next(e);
    };
  });


// Get all user messages.  **Only accessibe by signed in acct user.**
router.get("/:username/all", ensureLoggedIn, ensureAuthUser,
  async function (req, res, next) {
    try {
      let allMessages = await Message.getAllMessages(req.params);
      return res.status(200).json(allMessages);
    } catch (e) {
      return next(e);
    };
  });

// Access given message information along with message sender & receiver bio's. If the message was sent to the user the read time is also updated.
router.get("/:username/read/:message_id", ensureLoggedIn, ensureAuthUser,
  async function (req, res, next) {
    try {
      let message = await Message.viewMessageID(req.params);
      return res.status(200).json(message);
    } catch (e) {
      return next(e);
    };
  });


module.exports = router;
