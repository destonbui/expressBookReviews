const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
require("dotenv").config();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  //Missing info
  if (!username || !password) {
    return res.status(422).json({ message: "Missing credentials" });
  }

  //User not registered
  const isExisted = users.findIndex((user) => user.username === username);

  if (isExisted == -1) {
    return res.status(409).json({
      message: "User not registered. Please register before you sign in.",
    });
  }
  //Password check
  const user = users[isExisted];

  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  //If username and password are valid do something below
  const token = jwt.sign({ username: user.username }, process.env.SECRET, {
    expiresIn: "1h",
  });
  return res
    .status(200)
    .json({ message: "Customer successfully signed in.", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const { review } = req.body;
  const authHeader = req.header("authorization");
  let usernameFromToken;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    const { username } = jwt.verify(token, process.env.SECRET);
    usernameFromToken = username;
  }

  //Check if isbn has result in database
  const result = books[isbn];

  if (!result) {
    return res.status(204).json({ message: "Book not found!" });
  }

  //check if there is review
  if (!review || review === "") {
    return res.status(204).json({ message: "Missing review." });
  }

  books[isbn].reviews[usernameFromToken] = {
    review: review,
  };
  return res.status(200).send(JSON.stringify(books[isbn], null, 4));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
