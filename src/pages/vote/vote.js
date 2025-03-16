const socket = io();

const voteResults = document.getElementById('vote-results');
const voteSelect = document.getElementById('vote-options');
const voteButton = document.getElementById('vote-button');

const _onLoadData = function(votes) {
    console.log(`[Socket.io] [load-data] initial data received from the server`);
    voteResults.innerText = JSON.stringify(votes);
    
    voteResults.innerHTML = '';
    voteSelect.innerHTML = '';
    Object.keys(votes).forEach((key)=>{
        const option = document.createElement('option');
        option.text = key;
        option.value = key;
        
        voteSelect.appendChild(option);

        const li = document.createElement('li');
        li.textContent = `${key}: ${votes[key]}`;

        voteResults.appendChild(li);
    });
    
    console.log(votes);
}

const _onUpdateData = function(votes) {
    console.log(`[Socket.io] [update-data] Data is updated on server`);
    voteResults.innerHTML = '';
    Object.keys(votes).forEach((key)=>{
        const li = document.createElement('li');
        li.textContent = `${key}: ${votes[key]}`;

        voteResults.appendChild(li);
    });
    console.log(votes);
};

const _onVoteButtonClick = function() {
    socket.emit('vote', voteSelect.value);
};

voteButton.addEventListener('click', _onVoteButtonClick);
socket.on('update-data', _onUpdateData);
socket.on('load-data', _onLoadData);

console.log('Script carregado');