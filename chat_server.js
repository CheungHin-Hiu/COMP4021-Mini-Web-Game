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

// Handle the /leaderboard endpoint
app.get("/leaderboard", (req, res) => {
    // Read users.json
    fs.readFile("./data/users.json", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ status: "error", error: "Could not read users.json" });
            return;
        }
        res.json(JSON.parse(data));
    });
});

app.get("/user-info", (req, res) => {
    if (!req.session.user) {
        res.status(401).json({
            status: "error",
            error: "User not logged in"
        });
        return;
    }
    const username = req.session.user.username;
    const users = JSON.parse(fs.readFileSync("./data/users.json"));
    const userInfo = users[username];
    if(userInfo) {
        res.json({
            status: "success",
            highestScore: userInfo.highestScore
        });
    } else {
        res.status(404).json({
            status: "error",
            error: "User data not found"
        });
    }
});

// Endpoint to update user stats
app.post("/update-stats", (req, res) => {
    //console.log("Update request received:", req.body);  // Log the incoming request body to debug

    const { username, newScore, gameWon } = req.body;
    const usersData = JSON.parse(fs.readFileSync("./data/users.json", 'utf8'));

    //console.log("Current users data:", usersData);  // See what the current users data looks like

    if (usersData[username]) {
        usersData[username].gamePlayed += 1;
        usersData[username].highestScore = Math.max(usersData[username].highestScore, newScore);
        if (gameWon) {
            usersData[username].gameWon += 1;
        }

        // Attempt to write to the file
        fs.writeFileSync("./data/users.json", JSON.stringify(usersData, null, 4));
        //console.log("Data updated for user:", username);
        res.json({ status: "success" });
    } else {
        res.status(404).json({ status: "error", error: "User not found" });
    }
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


//Create a http server
const {createServer} = require("http");
const {Server} = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);

//Storing the total user connected to the server
let userNo = 0;

//Storing the game room #
let gameRoomNo;

//URL for the game ending screen
const gameOverRedirectionURL = "game_over.html";

//Adding a new user to the online user list when the player connects to the WebSocket server
io.on("connection", (socket) => {
    
    userNo++;
    gameRoomNo = Math.round(userNo / 2);
    socket.join(gameRoomNo);
  
    if(userNo % 2 == 1){
        socket.emit("entered room", gameRoomNo, 0);
    }
    else if(userNo % 2 == 0){
        socket.emit("entered room", gameRoomNo, 1)
        io.to(gameRoomNo).emit("MatchFound");
    }


    //This event tells the opponent that another player have hitted the object i
    socket.on("fire event", (roomNo, playerId, awardPoints, objectHitted) => 
    {
        let randomizationList = [];
        randomizationList.push(objectHitted);
        randomizationList.push(Math.floor(Math.random() *4));
        randomizationList.push(Math.floor(Math.random() *2));
        randomizationList.push(objectHitted);
        io.to(roomNo).emit("enemy hit", playerId, awardPoints);

        io.to(roomNo).emit("regenerate hitted object", randomizationList);
    });

    //This event updates the enemyGun image of the opponent
    socket.on("graphic info", (roomNo, playerId, gun_x, gun_y) => {
        io.to(roomNo).emit("graphic update", playerId, gun_x, gun_y);
    });

    //This event synchronize the time of 
    socket.on("time synchronzation", (roomNo, playerId, timeRemaining, gameStartTime) =>
    {
        io.to(roomNo).emit("time update", playerId, timeRemaining, gameStartTime);
    })

    //Initialization of game object and ability
    socket.on("initital randomization", (roomNo) => {
        let randomizationList = [];
        for(let i = 0; i < 3 ; i++){
            randomizationList.push(i);
            randomizationList.push(Math.floor(Math.random() *4));
            randomizationList.push(Math.floor(Math.random() *2));
            randomizationList.push(i);
        }
        randomizationList.push(Math.floor(Math.random() *2));
        randomizationList.push(Math.floor(Math.random() * 800 + 100));

        io.to(roomNo).emit("randomization list", randomizationList);
    });

    //Regenerate new object
    socket.on("renew object", (roomNo, i) => {
        let randomizationList = [];
        randomizationList.push(i);
        randomizationList.push(Math.floor(Math.random() *4));
        randomizationList.push(Math.floor(Math.random() *2));
        randomizationList.push(i);
        io.to(roomNo).emit("regenerate object", randomizationList);
    });

    //Regenerate new ability
    socket.on("renew ability", (roomNo, i) => {
        let randomizationList = [];
        randomizationList.push(Math.floor(Math.random() *2));
        randomizationList.push(Math.floor(Math.random() * 800 + 100));
        io.to(roomNo).emit("regenerate ability", randomizationList);
    });

    //Notify players that cheat code x (+points and decrease game time)was used
    socket.on("use cheat code x", (roomNo, playerId) => {
        io.to(roomNo).emit("other player use x", playerId);
    });

    //Notify players that cheat code z (stop other from moving) is used
    socket.on("use cheat code z", (roomNo, playerId) => {
        io.to(roomNo).emit("other player use z", playerId);
    });
    
    socket.on("game end", () => {
        socket.emit("redirection to game ending screen", gameOverRedirectionURL);
    });

    socket.on("disconnect", ()=>{
        console.log("player disconnect form server");
    });


});

//Start the server
httpServer.listen(8000);
