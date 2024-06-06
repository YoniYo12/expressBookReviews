const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const doesExist = (username)=>{
        let userswithsamename = users.filter((user)=>{
          return user.username === username
        });
        if(userswithsamename.length > 0){
          return true;
        } else {
          return false;
        }
      }
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    async function getBooks() {
        try {
            const response = await axios.get('http://localhost:5000');
            return response.data;
        } catch (error) {
            console.error('Error fetching books:', error.response.data);
            throw error;
        }
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    async function getBookByISBN(isbn) {
        try {
            // Make GET request to fetch book details
            const response = await axios.get(`http://localhost:5000/isbn/1`);
    
            // Return the book details from the response data
            return response.data;
        } catch (error) {
            // Handle error if request fails
            console.error(`Error fetching book with ISBN ${isbn}:`, error.response.data);
            throw error;
        }
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    async function getBooksByAuthor(author) {
        try {  
            const response = await axios.get(`http://loaclhost:5000/author/${author}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching books by author ${author}:`, error.response.data);
            throw error;
        }
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    async function getBooksByTitle(title) {
        try {
            const response = await axios.get(`http://localhost:5000/title/${title}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching books by title ${title}:`, error.response.data);
            throw error;
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn= req.params.isbn;
    const book= books[isbn];

    if(book){
        res.send(book.reviews);
    }

});

module.exports.general = public_users;
