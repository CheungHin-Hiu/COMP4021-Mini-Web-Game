//Create exepress server
const express = require("express");

//Create the express app
const app = express();

//Use the "public" folder to server static files
app.use(express.static("public"));

//Use the json middleware to parse JSON data
app.use(express.json());

//Create a http server
const {createServer} = require("http");
const {Server} = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);

//Objects storing the online players
const onlineUsers = {};

//The game room pairing up the players
let gameRoom = [];

//The pending list of the player
let pendingList = [];
//Adding a new user to the online user list when the player connects to the WebSocket server
io.on("connection", (socket) => {
    
    const socketID = socket.id;  //Access the scoket.id value
    if(gameRoom.length ==  0){
        console.log("pushed first player");
        gameRoom.push(socketID);
    }
    else if(gameRoom.length == 1){
        console.log("pushed second player");
        gameRoom.push(socketID);
        socket.broadcast.to(gameRoom[0]).emit("MatchFound", 0);
        socket.broadcast.to(gameRoom[1]).emit("MatchFound", 1);
    }
    else{
        pendingList.push(socketID);
    }

    socket.on("fire hit", (playerID, points) => 
    {
        socket.broadcast.to(gameRoom[(playerID + 1) % 2]).emit("Enemy pint", points);
    });


})

//Start the server
httpServer.listen(8000);