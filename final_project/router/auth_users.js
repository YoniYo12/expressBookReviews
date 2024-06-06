const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
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
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

regd_users.put("auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.session.username;
    if (!username) {
        return res.status(401).json({ error: 'Unauthorized - User not logged in' });}
    if (!review) {
        return res.status(400).json({ error: 'Review is required' });}
    if (!isbn) {
        return res.status(400).json({ error: 'ISBN is required' });}
    const existingReviewIndex = books[isbn].reviews.findIndex
    (item => item.username === username);
    if (existingReviewIndex !== -1) {
      
        books[isbn].reviews[existingReviewIndex].review = review;
        return res.status(200).json({ message: 'Review modified successfully' });
    } else {       
        books[isbn].reviews.push({ username, review });
        return res.status(201).json({ message: 'Review added successfully' });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.session.username;
    if (!username) {
        return res.status(401).json({ error: 'Unauthorized - User not logged in' });
    }
    if (!isbn) {
        return res.status(400).json({ error: 'ISBN is required' });
    }
    if (!books[isbn]) {
        return res.status(404).json({ error: 'Book not found' });
    }
    books[isbn].reviews = books[isbn].reviews.filter(review => 
        review.username !== username);
    return res.status(200).json({ message: 'Review deleted successfully' });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
