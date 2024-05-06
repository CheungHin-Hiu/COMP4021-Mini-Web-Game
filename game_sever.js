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

// //The game room pairing up the players
// let gameRoom = [];

let userNo = 0;

let gameRoomNo;

//Adding a new user to the online user list when the player connects to the WebSocket server
io.on("connection", (socket) => {
    
    userNo++;
    gameRoomNo = Math.round(userNo / 2);
    socket.join(gameRoomNo);
    const socketID = socket.id;  //Access the scoket.id value
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

    socket.on("renew object", (roomNo, i) => {
        let randomizationList = [];
        randomizationList.push(i);
        randomizationList.push(Math.floor(Math.random() *4));
        randomizationList.push(Math.floor(Math.random() *2));
        randomizationList.push(i);
        io.to(roomNo).emit("regenerate object", randomizationList);
    });

    socket.on("renew ability", (roomNo, i) => {
        let randomizationList = [];
        randomizationList.push(Math.floor(Math.random() *2));
        randomizationList.push(Math.floor(Math.random() * 800 + 100));
        io.to(roomNo).emit("regenerate ability", randomizationList);
    });

    socket.on("use cheat code x", (roomNo, playerId) => {
        io.to(roomNo).emit("other player use x", playerId);
    });

    socket.on("use cheat code z", (roomNo, playerId) => {
        io.to(roomNo).emit("other player use z", playerId);
    })
    


});

//Start the server
httpServer.listen(8000);