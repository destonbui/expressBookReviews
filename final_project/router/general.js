const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const result = books[isbn];

  if (result) {
    return res.status(200).send(JSON.stringify(result, null, 4));
  } else {
    return res.status(204).json({ message: "Book not found!" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(
    (book) => book.author === author
  );

  if (authorBooks.length > 0) {
    return res.status(200).send(JSON.stringify(authorBooks, null, 4));
  } else {
    return res
      .status(204)
      .json({ message: "Can not find any books related to author." });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  const results = Object.values(books).filter((book) => book.title === title);

  if (results.length > 0) {
    return res.status(200).send(JSON.stringify(results, null, 4));
  } else {
    return res
      .status(204)
      .json({ message: "Can not find any books with that title." });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
