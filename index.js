'use strict';

var os = require('os');
var nodeStatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');
var PORT = process.env.PORT || 3000;


var fileServer = new(nodeStatic.Server)();
var app = http.createServer(function(req, res) {
  fileServer.serve(req, res);
}).listen(PORT);

var io = socketIO.listen(app);

function t(){
    console.log(Date.now());
}


io.sockets.on('connection', function(socket) {

    function log() {
        var array = ['Message from server:'];
        array.push.apply(array, arguments);
        socket.emit('log', array);
      }

    socket.on('message',function(message, clientId, id) {
        io.to(clientId).emit('message', message, id);
    })

    socket.on('sendConnect', function(dest_Id, clientId, room){
        io.to(dest_Id).emit('sendConnect', clientId);
        //io.sockets.in(room).emit('ready', room);
        //socket.broadcast.emit('ready', room);
    })

    socket.on('reset', function(room){
        io.sockets.in(room).emit('reset');
    })

    socket.on('ready', function(dest_Id, clientId){
        log("Ready in server");
        io.to(dest_Id).emit('ready', clientId);
    })

    socket.on('create or join', function(room) {
        log('Received request to create or join room ' + room);
    
        var clientsInRoom = io.sockets.adapter.rooms[room];
        var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
        log('Room ' + room + ' now has ' + numClients + ' client(s) and socketid is' + socket.id);
        
        if(numClients<3)
        {
            socket.join(room);
            log("Joined Successfully");
            socket.emit('socketid', socket.id);
            clientsInRoom = io.sockets.adapter.rooms[room];
            socket.emit('Display clients', Object.keys(clientsInRoom.sockets));
        }
        else
        {
            log("Room is full");
        }
    })

})
