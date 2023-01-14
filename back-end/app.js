const express = require('express');
const app = express();
const authRoutes = require("./routes/userAuth");
const {ExpressError} = require("./ErrorHandling/expressError");

app.use(express.json());

// app use this prefix for routes in this file.
app.use("/auth", authRoutes);

app.get("/works", async function (req,res,err){
  return res.json({"worked": "like a charm"})
});

// Generic error handler for cases not explicitly caught."
app.use(function (err, req, res, next){
  if(process.env.NODE_ENV !== "test") console.log(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({error: {message, status}});
});


// starts server on port 3000
module.exports = app;

