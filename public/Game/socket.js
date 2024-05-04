
const Socket = (function() {
    //This stores the current Socket.IO socket
    let socket = null;

    let userId;
    //The function geths the socket from the module
    const getSocket = function() {
        return socket;
    }

    //This function connects the server and initializes the socket
    const connect = function(){
        //Connect to the servver
        socket = io();

        socket.on("connect", () => {
            console.log("connected sucessfully");
        });

        //Set up the matchFound event
        socket.on("MatchFound", (id) => {
            userId = id;
            gameStartCountDown();
        });

    }

    return {getSocket, connect};
})();