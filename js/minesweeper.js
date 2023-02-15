const $mines_count = document.querySelector('#mines-count');
const $board = document.querySelector('#board');
const $timer = document.querySelector('#timer');


var tilesClicked = 0;
var flagEnabled = false;

var gameOver = false;

var board = [];
const columns = 8;
const rows = columns;

const minesCount = 8;
const minesLocation = []; // 2-2, 3-4, 2-1

let s = 0;
let m = 0;

const timer =
    setInterval(function time() {

        if (gameOver) { return `${m}:${s < 9 ? '0' + s : s}`; }

        if (s == 59) {
            s = 0;
            m++
        } else {
            s++
        }

        $timer.innerHTML = `${m}:${s < 9 ? '0' + s : s}`

    }, 1000);


function setMines() {

    minesLocation.length = 0;

    let control = minesCount;
    while (control > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r + "-" + c;

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            control--;
        }
    }
}

function startGame() {
    $mines_count.innerHTML = minesCount;
    setMines();

    for (let r = 0; r < rows; r++) {
        let row = [];

        for (let c = 0; c < columns; c++) {
            let tile = document.createElement('div');
            tile.id = r.toString() + '-' + c.toString();
            tile.addEventListener('click', clickTile)
            $board.appendChild(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

function revealMines() {

    //Realizamos 2 loops para passar por todas as linhas e colunas e revelar a posição de todas as bombas do jogo
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerHTML = "💣"
                tile.style = "background-color: red;"
            }
        }
    }
}

function checkMine(r, c) {

    //Se o ID estiver fora do tabuleiro ele sai da função
    if (r < 0 || r >= rows || c < 0 || c >= columns) return;

    //Se o campo onde que está sendo feita a verificação já tiver sido clicado ele encerra a função
    if (board[r][c].classList.contains("tile-clicked")) return;

    board[r][c].classList.add("tile-clicked");
    tilesClicked++;

    let minesFound = 0;

    //top 3
    minesFound += checkTile(r - 1, c - 1);  //top lefht
    minesFound += checkTile(r - 1, c);      //top
    minesFound += checkTile(r - 1, c + 1);  //top right

    //lefht and right
    minesFound += checkTile(r, c - 1)
    minesFound += checkTile(r, c + 1)

    //bottom
    minesFound += checkTile(r + 1, c - 1);  //bottom lefht
    minesFound += checkTile(r + 1, c);      //bottom
    minesFound += checkTile(r + 1, c + 1);  //bottom right

    //Se tiver alguma bomba proxima ele coloca a class com o numero de bombas proxima (que e apresentado o valor com o CSS)
    if (minesFound > 0) {
        board[r][c].classList.add("x" + minesFound)
    }
    //Realizamos o processo de verificação de forma igual para todos os campos envolta da area de clique e isso ocorre repetiradas vezes até ele achar uma bomba envolta
    else {
        checkMine(r - 1, c - 1);  //top lefht
        checkMine(r - 1, c);      //top
        checkMine(r - 1, c + 1);  //top right

        checkMine(r, c - 1)       //right
        checkMine(r, c + 1)       //lefht

        checkMine(r + 1, c - 1);  //bottom lefht
        checkMine(r + 1, c);      //bottom
        checkMine(r + 1, c + 1);  //bottom right
    }

    if (rows * columns - minesCount - tilesClicked === 0) {
        renderResultGame('Win')
        gameOver = true;
    }

}

function renderResultGame(status) {

    let screenResetGame = document.createElement('div');
    screenResetGame.classList.add('reset');
    screenResetGame.innerHTML =
        `<div class="reset">
            <div class="container">
                <img src="./img/bomb.png" alt="">
                <h1>${status}!</h1>
            </div>
            <button onclick='restartGame()'id="reset">Reiniciar</button>
        </div>`

    $board.appendChild(screenResetGame)
}

/* --- Eventos --- */

function restartGame() {
    //Limpa o contador casa marcadas
    tilesClicked = 0;

    //Limpa o tabuleiro
    $board.innerHTML = '';
    board.length = 0;

    //Ativa o jogo de novo
    gameOver = false;

    //Zera o timer
    s = 0;
    m = 0;

    //Cria o taboleiro inteiro de novo
    startGame();
}

function checkTile(r, c) {
    let id = r.toString() + '-' + c.toString()

    //Se o ID estiver fora do tabuleiro ele sai da função
    if (r < 0 || r >= rows || c < 0 || c >= columns) return 0;

    if (minesLocation.includes(id)) {
        return 1;
    }
    return 0;
}

function clickTile() {
    let tile = this;

    if (tile.classList.contains("tile-clicked") || gameOver) return;


    //se a função de marcação com a bandeira estiver ativo ele só adicona ou remove bandeiras do board
    if (flagEnabled) {
        switch (tile.innerHTML) {
            case "🚩":
                tile.innerHTML = "";
                break;
            default:
                tile.innerHTML = "🚩";
                break;
        }

        return;
    }

    //Verifica se a pessoa selecionou um campo com mina ou não
    if (minesLocation.includes(tile.id)) {
        revealMines();
        gameOver = true;
        renderResultGame('Loser')
        return;
    }

    //Dividimos o ID em 2 elementos array para identificar a posição dele analisar os elementos envolta dele
    let coords = tile.id.split("-"); // "0-1" -> ["0", "1"]
    let r = +coords[0]; //convertendo String em int
    let c = +coords[1];

    checkMine(r, c);
}

document.querySelector('#flag-button').addEventListener("click", function () {
    //estamos invertendo o valor do atributo que informa se o modo de marcação está ativo ou desativo
    flagEnabled = !flagEnabled;
    //se ele tiver ativo ele deixar com a cor mais escura se desativo mais claro
    this.style = flagEnabled ? "background-color: darkgray;" : "background-color: lightgray;"
})

window.onload = function () {

    $board.style = `grid-template-columns: repeat(${columns}, auto);`
    startGame();
}