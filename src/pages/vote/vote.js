const socket = io();

const voteResults = document.getElementById('vote-results');
const voteSelect = document.getElementById('vote-options');
const voteButton = document.getElementById('vote-button');

voteButton.addEventListener('click', () => {
    socket.emit('vote', voteSelect.value);
});

socket.on('update-data', (votes) => {
    console.log(`[Socket.io] [update-data] Data is updated on server`);
    voteResults.innerText = JSON.stringify(votes);
    console.log(votes);
});

socket.on('load-data', (votes) => {
    console.log(`[Socket.io] [load-data] initial data received from the server`);
    voteResults.innerText = JSON.stringify(votes);

    voteSelect.innerHTML = '';
    Object.keys(votes).forEach((key)=>{
        const option = document.createElement('option');
        option.text = key;
        option.value = key;

        voteSelect.appendChild(option);
    });

    console.log(votes);
});

console.log('Script carregado');