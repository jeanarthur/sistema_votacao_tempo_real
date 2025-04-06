const socket = io();

const voteResults = document.getElementById('vote-results');
const voteSelect = document.getElementById('vote-options');
const voteButton = document.getElementById('vote-button');

const optionColors = {};

const _generatePastelColor = function() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 60 + Math.floor(Math.random() * 20);
    const lightness = 45 + Math.floor(Math.random() * 10);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const _getOptionColor = function(optionKey) {
    if (!optionColors[optionKey]) {
        optionColors[optionKey] = _generatePastelColor();
    }
    return optionColors[optionKey];
};

const _calculateMaxVotes = function(votesData) {
    return Math.max(...Object.values(votesData));
};

const _createVoteBar = function(votes, maxVotes, optionKey) {
    const percentage = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
    
    const barContainer = document.createElement('div');
    barContainer.className = 'vote-bar-container';
    
    const bar = document.createElement('div');
    bar.className = 'vote-bar';
    bar.style.width = `${percentage}%`;
    bar.style.backgroundColor = _getOptionColor(optionKey);
    
    barContainer.appendChild(bar);
    return barContainer;
};

const _onLoadData = function(votes) {
    console.log(`[Socket.io] [load-data] initial data received from the server`);
    const votesData = votes;
    const maxVotes = _calculateMaxVotes(votesData);
    
    voteResults.innerHTML = '';
    voteSelect.innerHTML = '';
    
    Object.keys(votesData).forEach((key) => {
        const option = document.createElement('option');
        option.text = key;
        option.value = key;
        voteSelect.appendChild(option);

        const li = document.createElement('li');
        
        const textContainer = document.createElement('div');
        textContainer.className = 'vote-text';
        
        const optionText = document.createElement('span');
        optionText.textContent = key;
        
        const voteCount = document.createElement('span');
        voteCount.className = 'vote-count';
        voteCount.textContent = `${votesData[key]} votos`;
        
        textContainer.appendChild(optionText);
        textContainer.appendChild(voteCount);
        
        const voteBar = _createVoteBar(votesData[key], maxVotes, key);
        
        li.appendChild(textContainer);
        li.appendChild(voteBar);
        voteResults.appendChild(li);
    });
};

const _onUpdateData = function(votes) {
    console.log(`[Socket.io] [update-data] Data is updated on server`);
    const votesData = votes;
    const maxVotes = _calculateMaxVotes(votesData);
    
    voteResults.innerHTML = '';
    Object.keys(votesData).forEach((key) => {
        const li = document.createElement('li');
        
        const textContainer = document.createElement('div');
        textContainer.className = 'vote-text';
        
        const optionText = document.createElement('span');
        optionText.textContent = key;
        
        const voteCount = document.createElement('span');
        voteCount.className = 'vote-count';
        voteCount.textContent = `${votesData[key]} votos`;
        
        textContainer.appendChild(optionText);
        textContainer.appendChild(voteCount);
        
        const voteBar = _createVoteBar(votesData[key], maxVotes, key);
        
        li.appendChild(textContainer);
        li.appendChild(voteBar);
        voteResults.appendChild(li);
    });
};

const _onVoteButtonClick = function() {
    socket.emit('vote', voteSelect.value);
};

voteButton.addEventListener('click', _onVoteButtonClick);
socket.on('update-data', _onUpdateData);
socket.on('load-data', _onLoadData);

socket.emit('get-data');

console.log('Script carregado');