const socket = io();

const btn = document.getElementById('btn');

btn.addEventListener('click', () => {
    socket.emit('vote');
});

console.log('Script carregado');