const express = require('express');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = require('http').createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'pages')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'vote', 'vote.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    
    socket.on('vote', (skt) => {
        console.log('a user voted');
    })
});


server.listen(3000, () => {
    console.log('Servidor rodando...');
});
