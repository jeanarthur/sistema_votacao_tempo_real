const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const { VoteService } = require('./services/vote.service');

const app = express();
const server = require('http').createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'pages')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'vote', 'vote.html'));
});

io.on('connection', (socket) => {
    console.log(`[Socket.io] [connection] User connected with id: ${socket.id}`);

    socket.emit('load-data', VoteService.getVotes());
    
    socket.on('vote', async (vote) => {
        console.log(`[Socket.io] [vote] Vote registered by user ${socket.id}`);
        VoteService.registerVote(vote)
            .then((result) => {
                io.emit('update-data', result);
            })
            .catch((error) => {
                console.error(error);
            });
    });
});

server.listen(3000, () => {
    console.log('Servidor rodando...');
});
