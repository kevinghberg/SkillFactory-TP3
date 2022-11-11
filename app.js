const express = require('express')
const router = require('./router')
require("dotenv").config()
const app = express()
const port = process.env.PORT
app.use('/', router);
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port} 🚀🚀🚀🚀`)
})

module.exports = {
  app,
  server
};
