require("dotenv").config()
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');

const { VoteService } = require('./services/vote.service');
const { SocketIoHandler } = require('./handlers/socketio_handler');

const connectDB = require("./database/mongo")

const app = express();
const server = require('http').createServer(app);
const io = new Server(server);

const socketIoHandler = new SocketIoHandler(io, VoteService);
socketIoHandler.init();

app.use(express.static(path.join(__dirname, 'pages')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'vote', 'vote.html'));
});

connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}...`);
});