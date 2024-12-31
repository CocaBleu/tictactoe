const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    // Lorsque le serveur reçoit un mouvement d'un joueur, il le diffuse
    socket.on('move', (data) => {
        socket.broadcast.emit('move', data);  // Diffuse le mouvement aux autres joueurs
    });

    // Lorsque le serveur reçoit un message de fin de jeu, il le diffuse
    socket.on('gameOver', (data) => {
        socket.broadcast.emit('gameOver', data);  // Envoie le message de fin de jeu aux autres joueurs
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});