const express = require('express');
const app = express();
const authRoutes = require("./routes/userAuth");

app.use(express.json());

// app use this prefix for routes in this file.
app.use("/auth", authRoutes)



// starts server on port 3000
module.exports = app;

