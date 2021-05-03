var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require("mongoose");
var cors = require('cors');
require('dotenv').config();
const http = require("http");
const socketIo = require("socket.io");
// var cors = require('cors');

var app = express();


const port = process.env.PORT || 3080;
const index = require("./routes/index");

app.use(index);
// app.use(cors());

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "*",
    }
});

let interval;

io.on("connection", (socket) => {
    console.log("New client connected");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);
    });
});

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));

// const io = require('socket.io')();

// io.on('connection', (client) => {
//   client.on('subscribeToTimer', (interval) => {
//     console.log('client is subscribing to timer with interval ', interval);
//     setInterval(() => {
//       client.emit('timer', new Date());
//     }, interval);
//   });
// });

// const port = 8000;
// io.listen(port);
// console.log('listening on port ', port);