const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

const path = require('path');



// Use the session middleware to maintain sessions
const chatSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(chatSession);

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    let { username, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const users = JSON.parse(fs.readFileSync("./data/users.json"))
    //
    // E. Checking for the user data correctness

    if(!username || !password){
        let missing;
        if(!username){
            missing = "Username "
        }
        else if(!password){
            missing = "Password "
        }
        console.log("missing: ", missing)
        res.json({
            status: "error",
            error: `${missing}can not be empty!`
        });
        return; // need return at error cuz this process needed to be ended
    }

    if(!containWordCharsOnly(username)){
        res.json({
            status: "error",
            error: "Username should only contain word or characters"
        })
        return; // need return at error cuz this process needed to be ended
    }
    if(username in users){
        res.json({
            status: "error",
            error: "User already exist"
        })
        return; // need return at error cuz this process needed to be ended
    }

    //
    // G. Adding the new user account
    //
    password = bcrypt.hashSync(password, 10);
    users[username] = { password, highestScore : 0, gamePlayed: 0, gameWon: 0};
    //
    // H. Saving the users.json file
    //
    fs.writeFileSync("./data/users.json", JSON.stringify(users, null, " "))
    //
    // I. Sending a success response to the browser
    //
    res.json({status: "success"})

    // Delete when appropriate
    // res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    //
    // D. Reading the users.json file
    //
    const users = JSON.parse(fs.readFileSync("./data/users.json"))

    //
    // E. Checking for username/password
    //
    if(!(username in users)){
        res.json({
            status: "error",
            error: "This username does not exist"
        })
        return;
    } 
    const hashedPassword = users[username].password;
    if (!bcrypt.compareSync(password, hashedPassword)) {
        res.json({
            status: "error",
            error: "Incorrect password"
        })
        return;
    }


    //
    // G. Sending a success response with the user account
    //
    console.log("sign in success")
    const userObj = { username, highestScore: users[username].highestScore, gamePlayed: users[username].gamePlayed, gameWon: users[username].gameWon};
    req.session.user = userObj;
    console.log("userObj",userObj)
    res.json({ status: "success", user: userObj});
 
    // Delete when appropriate
    // res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {

    //
    // B. Getting req.session.user
    //
    const user = req.session.user;


    //
    // D. Sending a success response with the user account
    //
    if(!user){
        res.json({
            status: "error",
            error: "Haven't login"
        })
        return;
    }
    res.json({status: "success", user: user})
 
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    //
    // Deleting req.session.user
    //
    delete req.session.user

    //
    // Sending a success response
    //
    res.json({status: "success"})
 
    // Delete when appropriate
    res.json({ status: "error", error: "This endpoint is not yet implemented." });
});


//
// ***** Please insert your Lab 6 code here *****
//


// Use a web server to listen at port 8000
app.listen(8000, () => {
    console.log("The chat server has started...");
});
