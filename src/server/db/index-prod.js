const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(
    "mongodb://monintermittencedb:dnptqd7e56L9lQpLzL440fTYYuA9gm2XPWp6tDcSlHqTLjglKGK4plw7EbElpK14V97JNdLh7YACuydQ3TaiAQ==@monintermittencedb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb",
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
