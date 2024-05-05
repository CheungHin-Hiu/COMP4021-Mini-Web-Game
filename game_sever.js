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
io.on("connection", 
(socket) => {
    
    const socketID = socket.id;  //Access the scoket.id value
    if(gameRoom.length ==  0){
        gameRoom.push(socketID);
    }
    else if(gameRoom.length == 1){
        gameRoom.push(socketID);
        io.to(gameRoom[0]).emit("MatchFound", 0);
        io.to(gameRoom[1]).emit("MatchFound", 1);
    }
    else{
        pendingList.push(socketID);
    }

    //This event tells the opponent that another player have hitted the object i
    socket.on("fire event", (playerId, awardPoints, objectHitted) => 
    {
        let randomizationList = [];
        randomizationList.push(objectHitted);
        randomizationList.push(Math.floor(Math.random() *4));
        randomizationList.push(Math.floor(Math.random() *2));
        randomizationList.push(objectHitted);
        io.to(gameRoom[(playerId + 1) % 2]).emit("enemy hit", awardPoints);

        io.to(gameRoom[0]).emit("regenerate hitted object", randomizationList);
        io.to(gameRoom[1]).emit("regenerate hitted object", randomizationList);
    });

    //This event updates the enemyGun image of the opponent
    socket.on("graphic info", (playerId, gun_x, gun_y) => {
        io.to(gameRoom[(playerId + 1) % 2]).emit("graphic update", gun_x, gun_y);
    });

    //This event synchronize the time of 
    socket.on("time synchronzation", (timeRemaining, gameStartTime) =>
    {
        io.to(gameRoom[1]).emit("time update", timeRemaining, gameStartTime);
    })

    //Initialization of game object and ability
    socket.on("initital randomization", () => {
        let randomizationList = [];
        for(let i = 0; i < 3 ; i++){
            randomizationList.push(i);
            randomizationList.push(Math.floor(Math.random() *4));
            randomizationList.push(Math.floor(Math.random() *2));
            randomizationList.push(i);
        }
        randomizationList.push(Math.floor(Math.random() *2));
        randomizationList.push(Math.floor(Math.random() * 800 + 100));

        io.to(gameRoom[0]).emit("randomization list", randomizationList);
        io.to(gameRoom[1]).emit("randomization list", randomizationList);
    });

    socket.on("renew object", (i) => {
        let randomizationList = [];
        randomizationList.push(i);
        randomizationList.push(Math.floor(Math.random() *4));
        randomizationList.push(Math.floor(Math.random() *2));
        randomizationList.push(i);
        io.to(gameRoom[0]).emit("regenerate object", randomizationList);
        io.to(gameRoom[1]).emit("regenerate object", randomizationList);
    });

    socket.on("renew ability", (i) => {
        let randomizationList = [];
        randomizationList.push(Math.floor(Math.random() *2));
        randomizationList.push(Math.floor(Math.random() * 800 + 100));
        io.to(gameRoom[0]).emit("regenerate ability", randomizationList);
        io.to(gameRoom[1]).emit("regenerate ability", randomizationList);
    });

    socket.on("use cheat code x", (i) => {
        io.to(gameRoom[(i + 1) % 2]).emit("other player use x");
    });
    


})

//Start the server
httpServer.listen(8000);