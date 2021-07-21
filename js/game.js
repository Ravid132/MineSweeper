'use strict'

var gBoard;
var gLevel = {
    SIZE: 4,
    MINES: 2,
    type: 'easy',
};
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    hints: 3,
    isHintOn: false
};
// var gCell;
var gTimerInterval;
const NORMAL_SMILEY = '😀';
const SAD_SMILEY = '🤯';
const WINNER_SMILEY = '😎';
const LOST_SMILEY = '😱';
// const HINT = '💡💡💡';



function initGame() {
    // gBoard = createMatrix(SIZE);
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        hints: 3,
        isHintOn: false
    };
    renderHints();
    document.querySelector('.lives').innerHTML = 'Lives: ' + gGame.lives;
    changeSmiley(NORMAL_SMILEY);
    // console.log(gBoard);
    gBoard = createMatrix();
    // setMinesNegsCout(gBoard);
    renderBoard(gBoard);
}

function beginGame(firstI, firstJ) { //when user clicks a cell the game starts
    gBoard = buildBoard(firstI, firstJ);
    setMinesNegsCout(gBoard);
    renderBoard(gBoard);
    var startTime = new Date();
    gTimerInterval = setInterval(showTimer, 1000, startTime);
    //start timer with interval
}

function setMinesNegsCout(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j].minesAroundCount = getAllNegs({ i, j }, board, gLevel.SIZE);
        }
    }

    console.log(board);
}

function cellClicked(i, j) {
    if (!gGame.shownCount) {
        console.log('game starts');
        gGame.isOn = true;
        beginGame(i, j);
    }
    if (gGame.isHintOn) {
        console.log('into revealHint');
        revealHint({ i: i, j: j });
        return;
    }
    if (!gBoard[i][j].isShown && gGame.isOn) {
        gBoard[i][j].isShown = true;
        gGame.shownCount++;
        console.log('shown counter', gGame.shownCount);
    }
    renderBoard(gBoard);//render cell instead of board?
    if (gBoard[i][j].isMine) {
        gGame.lives--;
        document.querySelector('.lives').innerHTML = 'Lives: ' + gGame.lives;
        changeSmiley(SAD_SMILEY);
        if (!gGame.lives) {
            changeSmiley(LOST_SMILEY);
            finishGame(false);
        }
    }
    console.log('clicked', gBoard[i][j]);
}

function cellMarked(i, j,) {
    console.log(i, j);
    if (!gGame.isOn) return;
    if (gBoard[i][j].isShown) return;
    gBoard[i][j].isMarked = (!gBoard[i][j].isMarked);
    (gBoard[i][j].isMarked) ? gGame.markedCount++ : gGame.markedCount--;
    renderBoard(gBoard);//change to render cell?

    if (checkGameOver()) {
        finishGame(true);
        console.log('WINNER!');
    }
    // console.log('right click');
    // return false;
}

function finishGame(isVictory) {
    if (isVictory) {
        highestScore(gLevel.type, gGame.secsPassed);
        changeSmiley(WINNER_SMILEY);
        gGame.isOn = false;
        //localStorage?
        //clear timer
    } else {
        gGame.isOn = false;
        revealMines();
    }
    clearInterval(gTimerInterval);
}

function buildBoard(posI, posJ) {
    var board = createMatrix(gLevel.SIZE); //return it
    var emptyCells = getEmptyCells(board, posI, posJ); //array of all empty cells in board
    console.log(emptyCells);
    for (var i = 0; i < gLevel.MINES; i++) {
        var randPos = getRandomIntegerInclusive(0, emptyCells.length - 1);
        var iIdx = emptyCells[randPos].i;
        var jIdx = emptyCells[randPos].j;
        console.log('mine at:', emptyCells[randPos].i, emptyCells[randPos].j);
        board[iIdx][jIdx].isMine = true;
        emptyCells.splice(randPos, 1);
    }
    // setMinesNegsCout(board);
    return board;
}

function createMatrix() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
            board[i][j] = cell;
        }
    }
    return board;
}

//Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {
    var numOfCellsWithNums = (gLevel.SIZE * gLevel.SIZE) - gLevel.MINES;
    return gGame.shownCount === numOfCellsWithNums && gGame.markedCount === gLevel.MINES;
}

function resetGame() {
    initGame();
}

function changeSmiley(face) {
    document.querySelector('.smiley').innerHTML = face;
}

function changeLevel(value) {
    switch (value) {
        case 'easy':
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            break;
        case 'medium':
            gLevel.SIZE = 8;
            gLevel.MINES = 12;
            break;
        case 'expert':
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
            break;

        default:
            break;
    }
    gLevel.type = value;
    clearInterval(gTimerInterval);
    initGame();
}

function activeHint(hint) {
    if (!gGame.isOn) {
        alert('game not started yet!');
        return;
    }
    gGame.isHintOn = true;
    console.log('This is the hint', hint);
    hint.style.display = 'none';//maybe change style
}

function showTimer(startTime) {
    // var now = new Date();
    // gGame.secsPassed = Math.floor((now - startTime) / 1000);
    // document.querySelector('.timer').innerText = gGame.secsPassed;
    // console.log(gGame.secsPassed);

    var diff = Math.floor((Date.now() - startTime) / 1000);

    console.log('seconds', diff);
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = diff;
    gGame.secsPassed = diff;
}

//renders
function renderHints() {
    var strHTML = '';
    var elHints = document.querySelector('.hints');
    for (var i = 0; i < gGame.hints; i++) {
        var str = '<span class"hint" onclick="activeHint(this)"> 💡</span>';
        // strHTML += '💡';
        strHTML += str;
    }
    elHints.innerHTML = strHTML;
}