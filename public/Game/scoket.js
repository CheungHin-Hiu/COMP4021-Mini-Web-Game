const Socket = (function() {
    //This stores the current Socket.IO socket
    let socket = null;

    let user
    //The function geths the socket from the module
    const getSocket = function() {
        return socket;
    }

    //This function connects the server and initializes the socket
    const connect = function(){
        socket = io();


    }
})