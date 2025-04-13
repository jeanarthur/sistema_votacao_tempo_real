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
    const options = Object.keys(voteSelect.options).map(key => voteSelect.options[key].value);
    
    if (optionKey === options[0]) {
        return '#d00303'; // Vermelho
    }
    else if (optionKey === options[1]) {
        return 'linear-gradient(90deg, rgba(55, 184, 109, 1) 0%, rgba(255, 229, 0, 1) 100%)';
    }
    
    return 'hsl(0, 0%, 50%)';
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
    
    // Verifica se a cor começa com 'linear-gradient'
    const color = _getOptionColor(optionKey);
    if (color.startsWith('linear-gradient')) {
        bar.style.background = color;
    } else {
        bar.style.backgroundColor = color;
    }
    
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

    const lastVoteTime = localStorage.getItem('lastVoteTime');
    if (lastVoteTime) {
        const hoursElapsed = (Date.now() - parseInt(lastVoteTime)) / (1000 * 60 * 60);
        if (hoursElapsed < 24) {
            voteButton.disabled = true;
            voteButton.style.opacity = '0.6';
            voteButton.style.cursor = 'not-allowed';
            voteButton.textContent = 'Já votou';
        }
    }
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

const showConfirmationModal = function(selectedOption, onConfirm) {
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    modalContainer.innerHTML = `
        <div class="modal-content">
            <h3>Confirmar Voto</h3>
            <p>Confirma seu voto em "${selectedOption}"?</p>
            <p class="modal-warning">Esta ação não poderá ser desfeita.</p>
            <div class="modal-buttons">
                <button class="modal-button cancel">Cancelar</button>
                <button class="modal-button confirm">Confirmar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalContainer);

    setTimeout(() => modalContainer.classList.add('visible'), 50);

    const confirmBtn = modalContainer.querySelector('.confirm');
    const cancelBtn = modalContainer.querySelector('.cancel');
    
    confirmBtn.addEventListener('click', () => {
        createConfetti();
        modalContainer.classList.remove('visible');
        setTimeout(() => {
            modalContainer.remove();
            onConfirm();
        }, 300);
    });

    cancelBtn.addEventListener('click', () => {
        modalContainer.classList.remove('visible');
        setTimeout(() => modalContainer.remove(), 300);
    });
};

const _onVoteButtonClick = function() {
    const lastVoteTime = localStorage.getItem('lastVoteTime');
    const timeoutHours = 24;
    
    if (lastVoteTime) {
        const hoursElapsed = (Date.now() - parseInt(lastVoteTime)) / (1000 * 60 * 60);
        if (hoursElapsed < timeoutHours) {
            return;
        }
    }
    
    const selectedOption = voteSelect.options[voteSelect.selectedIndex].text;
    showConfirmationModal(selectedOption, () => {
        localStorage.setItem('lastVoteTime', Date.now().toString());
        
        voteButton.disabled = true;
        voteButton.style.opacity = '0.6';
        voteButton.style.cursor = 'not-allowed';
        voteButton.textContent = 'Já votou';
        
        socket.emit('vote', voteSelect.value);
    });
};

voteButton.addEventListener('click', _onVoteButtonClick);
socket.on('update-data', (votation) => {
    _onUpdateData(votation);
});
socket.on('load-data', _onLoadData);

socket.emit('get-data');

console.log('Script carregado');

    // Atualização da função de criar confete
function createConfetti() {
    const selectedOption = voteSelect.value;
    const options = Object.keys(voteSelect.options).map(key => voteSelect.options[key].value);
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.top = `${Math.random() * 20 - 20}vh`;
        
        // Para a segunda opção, alterna entre verde e amarelo
        if (selectedOption === options[1]) {
            const isGreen = Math.random() > 0.5;
            if (isGreen) {
                confetti.style.background = 'linear-gradient(45deg, #4CAF50 0%, #81C784 100%)';
            } else {
                confetti.style.background = 'linear-gradient(45deg, #FFEB3B 0%, #FFF176 100%)';
            }
        } else {
            // Para a primeira opção (vermelho)
            confetti.style.background = 'linear-gradient(45deg, #f44336 0%, #ef5350 100%)';
        }
        
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        
        confetti.style.animationDuration = `${Math.random() * 2 + 1}s`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 2000);
    }
}