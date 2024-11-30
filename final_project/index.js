const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const { users } = require("./router/auth_users.js");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
require("dotenv").config();

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  const authHeader = req.headers["authorization"];

  //check if there's auth header
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    const { username } = jwt.verify(token, process.env.SECRET);
    const isValid = users.find((user) => user.username === username);

    if (isValid) {
      //user authorized
      next();
    } else {
      return res
        .status(401)
        .json({ message: "You are not authorized. Please sign in." });
    }
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
