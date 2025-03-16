class SocketIoHandler {

    _io;
    _voteService;
    _socket;

    constructor(io, voteService) {
        this._io = io;
        this._voteService = voteService;
    }
    
    init() {
        this._io.on('connection', this._onConnection.bind(this));
    }

    _onConnection(socket) {
        this._socket = socket;
        console.log(`[Socket.io] [connection] User connected with id: ${this._socket.id}`);
        socket.emit('load-data', this._voteService.getVotes());
        socket.on('vote', this._onVote.bind(this)); 
    }

    _onVote(vote) {
        console.log(`[Socket.io] [vote] Vote registered by user ${this._socket.id}`);
        this._voteService.registerVote(vote)
            .then((result) => {
                this._io.emit('update-data', result);
            })
            .catch((error) => {
                console.error(error);
            });
    }

}

module.exports = {
    SocketIoHandler
}