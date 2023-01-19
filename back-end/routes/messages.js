const router = require("express").Router();
const Message = require("../Models/message");
const {ensureAuthUser} = require("../Middleware/auth");

// All routes prefixed with "/messages." All require auth and project match.

// Create new msg. **Requires users to have matching project_id's**
// auth user/ logged in & matches proj
router.post("/:username/create", ensureAuthUser,
async function (req, res, next){
  try {
    // message from is always the signed in user
    let newMessage = await Message.createMessage(req.params.username, req.body);
    return res.status(201).json(newMessage);
  } catch(e){
    return next(e);
  };
});


// Get all user messages.  **Only accessibe by signed in acct user.**
router.get("/:username/all", ensureAuthUser,
async function (req, res, next){
  try{
    let allMessages = await Message.getAllMessages(req.params);
    return res.status(200).json(allMessages);
  } catch(e){
    return next(e);
  }
});

// Grab message information along with message sender & receive bio's. If the message was sent to the user the read time is also updated.
router.get("/:username/read/:message_id", ensureAuthUser,
async function (req, res,next){
  try{
    console.log("here")
    let message = await Message.viewMessageID(req.params);
    return res.status(200).json(message);
  } catch(e){
    return next(e);
  };
});






module.exports = router;
