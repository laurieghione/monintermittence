const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(
    "mongodb://monintermittencedb:AC7dvtc8IxdKFfxboDIaO6ThDdXerABbzJ6WepEqW3rGmC9ZQ8feJzVYJNbqGSGV03xqgGVHut6JdJmWeONMUQ%3D%3D@monintermittencedb.mongo.cosmos.azure.com:10255/?ssl=true&appName=@monintermittencedb@",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;

module.exports = db;
