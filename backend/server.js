const app = require("./app");
const {PORT} = require("./config");

app.listen(PORT, function () {
  console.log(`App live on port ${PORT}.`)
});