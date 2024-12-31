const socket = io();

let player = 'X';  // Commence par X
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Représente l'état du jeu
let isGameOver = false;

const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');

// Mise à jour du tableau de jeu sur le frontend
function updateBoard() {
    cells.forEach((cell, index) => {
        cell.textContent = gameBoard[index];
    });
}

// Vérification des conditions de victoire
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes
        [0, 4, 8], [2, 4, 6] // Diagonales
    ];

    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            isGameOver = true;
            status.textContent = `Le joueur ${gameBoard[a]} a gagné!`;
            socket.emit('gameOver', { message: `Le joueur ${gameBoard[a]} a gagné!` });
            return;
        }
    }

    if (!gameBoard.includes('')) {
        isGameOver = true;
        status.textContent = 'Match nul!';
        socket.emit('gameOver', { message: 'Match nul!' });
    }
}

// Gérer un clic sur une cellule
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.getAttribute('data-index');

        if (gameBoard[index] === '' && !isGameOver) {
            gameBoard[index] = player;
            updateBoard();
            checkWin();
            socket.emit('move', { index, player });  // Envoi du mouvement au serveur
            player = (player === 'X') ? 'O' : 'X';  // Changer de joueur
            status.textContent = `C'est au tour du joueur ${player}`;
        }
    });
});

// Réception du mouvement d'un autre joueur
socket.on('move', (data) => {
    gameBoard[data.index] = data.player;
    updateBoard();
    checkWin();
    player = (player === 'X') ? 'O' : 'X';
    status.textContent = `C'est au tour du joueur ${player}`;
});

// Réception du message de fin de jeu
socket.on('gameOver', (data) => {
    status.textContent = data.message;
});