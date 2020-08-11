const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./routes/router");
const db = require("./db/index-prod.js");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
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
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use("/api", router);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
