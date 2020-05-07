const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./routes/router");
const db = require("./db");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const checkScope = require("express-jwt-authz");
require("dotenv").config();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
});

const app = express();
const apiPort = 3000;

app.use(checkJwt);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use("/api", router);

app.get("/public", checkJwt, function (req, res) {
  res.json({
    message: "Hello from a public API",
  });
});
//app.get("/courses", checkJwt, checkScope(["read:declarations"]), function (

app.get("/private", checkJwt, function (req, res) {
  res.json({
    message: "Hello from a private API",
  });
});

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
