const $mines_count = document.querySelector('#mines-count');
const $board = document.querySelector('#board');

var board = [];
const columns = 8;
const rows = columns;

const minesCount = 5;
const minesLocation = []; // 2-2, 3-4, 2-1
function setMines() {
    minesLocation.push('2-2');
    minesLocation.push('2-3');
    minesLocation.push('5-6');
    minesLocation.push('3-4');
    minesLocation.push('1-1');
}

var tilesClicked = 0;
var flagEnabled = false;

var gameOver = false;

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

/* --- Eventos --- */
function clickTile() {
    let tile = this;

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
    }

    //Verifica se a pessoa selecionou um campo com mina ou não
    if (minesLocation.includes(tile.id)) {
        revealMines();
        gameOver = true;
        //alert('Perdeu')
        return;
    }
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