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

const _onLoadData = function(votation) {
    console.log(`[Socket.io] [load-data] initial data received from the server`);
    const votesData = votation?.votes;
    const maxVotes = _calculateMaxVotes(votesData);

    const titleElement = document.getElementById('vote-title');
    const descriptionElement = document.getElementById('vote-description');
    const optionsTitleElement = document.getElementById('vote-options-title');

    titleElement.innerText = votation?.title;
    descriptionElement.innerText = votation?.description;
    optionsTitleElement.innerText = votation?.options_title;
    
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

const _onUpdateData = function(votation) {
    console.log(`[Socket.io] [update-data] Data is updated on server`);
    const votesData = votation?.votes;
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

// Atualização da função de criar confete
function createConfetti() {
    // Pega a opção selecionada
    const selectedOption = voteSelect.value;
    // Pega a cor associada à opção
    const baseColor = _getOptionColor(selectedOption);
    
    // Converte a cor HSL para valores individuais
    const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    const baseHue = parseInt(hslMatch[1]);
    
    // Aumenta o número de partículas
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Distribui as partículas por toda a largura da tela
        confetti.style.left = `${Math.random() * 100}vw`;
        
        // Posição inicial aleatória no topo
        confetti.style.top = `${Math.random() * 20 - 20}vh`;
        
        // Varia a cor levemente baseada na cor da opção selecionada
        const hueVariation = baseHue + (Math.random() * 20 - 10);
        const saturation = 60 + Math.random() * 20;
        const lightness = 45 + Math.random() * 10;
        confetti.style.backgroundColor = `hsl(${hueVariation}, ${saturation}%, ${lightness}%)`;
        
        // Tamanhos variados
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        // Velocidades diferentes
        confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
        
        document.body.appendChild(confetti);
        
        // Remove o elemento após a animação
        setTimeout(() => confetti.remove(), 2000);
    }
}