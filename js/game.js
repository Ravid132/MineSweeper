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
    isHintOn: false,
    safeClick: 3,
};
// var gCell;
var gTimerInterval;
var gState = [];

// init variables
function initGame() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        hints: 3,
        isHintOn: false,
        safeClick: 3,
    };
    gState = [];
    renderHints();
    document.querySelector('.lives').innerHTML = 'Lives: ' + gGame.lives;
    renderSmiley(false);
    gBoard = createMatrix();
    renderBoard(gBoard);
    clearInterval(gTimerInterval);
}

//starts the game making board,setting mines,renders..
function beginGame(firstI, firstJ) { //when user clicks a cell the game starts
    gBoard = buildBoard(firstI, firstJ);
    setMinesNegsCout(gBoard);
    renderBoard(gBoard);
    updateState();
    var startTime = new Date();
    gTimerInterval = setInterval(showTimer, 1000, startTime);
    //start timer with interval
}

//set mines
function setMinesNegsCout(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j].minesAroundCount = getAllNegs({ i, j }, board, gLevel.SIZE);
        }
    }

    console.log(board);
}

//handle left click on cell
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
    updateState();
    if (!gBoard[i][j].isShown && gGame.isOn) {
        // gBoard[i][j].isShown = true;
        // gGame.shownCount++;
        recursiveOpenCells(i, j);
    }
    renderBoard(gBoard);
    if (gBoard[i][j].isMine) {
        gGame.lives--;
        document.querySelector('.lives').innerText = 'Lives: ' + gGame.lives;
        renderSmiley(false);
        if (!gGame.lives) {
            renderSmiley(false);
            finishGame(false);
        }
    }
}

//handle right click on cell
function cellMarked(ev, i, j) {
    ev.preventDefault();
    if (!gGame.isOn) return;
    if (gBoard[i][j].isShown) return;
    gBoard[i][j].isMarked = (!gBoard[i][j].isMarked);
    (gBoard[i][j].isMarked) ? gGame.markedCount++ : gGame.markedCount--;
    renderBoard(gBoard);

    if (checkGameOver()) {
        finishGame(true);
        console.log('WINNER!');
    }
    updateState();
}

//handles ending game (saves score,change smiley,reveals mines,clear interval)
function finishGame(isVictory) {
    if (isVictory) {
        highestScore(gLevel.type, gGame.secsPassed);
        renderSmiley(true);
        gGame.isOn = false;
    } else {
        gGame.isOn = false;
        revealMines();
    }
    clearInterval(gTimerInterval);
}

//building board
function buildBoard(posI, posJ) {
    var board = createMatrix(gLevel.SIZE);
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
    return board;
}

//creating a matrix with cell object
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
    console.log('nums of cells', numOfCellsWithNums);
    console.log('Count', gGame.shownCount);
    console.log('gGame.markedCount', gGame.markedCount);
    return gGame.shownCount === numOfCellsWithNums && gGame.markedCount === gLevel.MINES;
}

//reset game
function resetGame() {
    initGame();
}

//changing level
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

//handle hints
function activeHint(hint) {
    if (!gGame.isOn) {
        alert('game not started yet!');
        return;
    }
    gGame.isHintOn = true;
    console.log('This is the hint', hint);
    hint.style.display = 'none';
}

//timer
function showTimer(startTime) {
    var diff = Math.floor((Date.now() - startTime) / 1000);
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = diff;
    gGame.secsPassed = diff;
}

//safe click button
function safeClick() {
    if (!gGame.isOn) return;
    if (!gGame.safeClick) {
        alert("you dont have any more safe click!");
        return;
    }
    var randCellPos = getRandomCell(gBoard);
    var elSafeCell = document.querySelector(`[data-i="${randCellPos.i}"][data-j="${randCellPos.j}"]`);
    console.log('safe cell', elSafeCell);
    elSafeCell.classList.remove('hide');
    elSafeCell.classList.add('safe-click');

    setTimeout(function () {
        elSafeCell.classList.add('hide');
        elSafeCell.classList.remove('safe-click');
    }, 1000)
    gGame.safeClick--;
}

//return random cell from board
function getRandomCell(board) {
    var emptyCells = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (!board[i][j].isShown && !board[i][j].isMine) emptyCells.push({ i: i, j: j });
        }
    }
    var cellsLength = emptyCells.length;
    if (!cellsLength) {
        console.log('No empty cells!');
        return;
    }
    var randCell = emptyCells[getRandomIntegerInclusive(0, cellsLength - 1)];
    return randCell;
}

//handle undo button
function undo() {
    if (gState.length === 0) {
        console.log('No more moves');
        return;
    }
    var prevMove = gState.pop();
    gBoard = prevMove.board;
    gGame.shownCount = prevMove.shownCount;
    gGame.markedCount = prevMove.markedCount;
    gGame.lives = prevMove.lives;
    gGame.safeClick = prevMove.safeClick;
    gGame.hints = prevMove.hints;

    renderBoard(gBoard);
    renderHints();
    renderLives();
    renderSmiley(false);
}

//putting current move in gState array to remember the move
function updateState() {
    gState.push({
        board: copyMat(gBoard),
        shownCount: gGame.shownCount,
        markedCount: gGame.markedCount,
        lives: gGame.lives,
        safeClick: gGame.safeClick,
        hints: gGame.hints
    });
}

//recursive closed cells open
function recursiveOpenCells(i, j) {
    gBoard[i][j].isShown = true;
    if (!gBoard[i][j].isMine && !gBoard[i][j].isMarked) gGame.shownCount++;
    renderBoard(gBoard);
    if (checkGameOver()) finishGame(true);
    if (gBoard[i][j].minesAroundCount > 0 || gBoard[i][j].isMine) return;
    for (var row = i - 1; row <= i + 1; row++) {
        if (row < 0 || gBoard.length <= row) continue;
        for (var col = j - 1; col <= j + 1; col++) {
            if (col < 0 || col >= gBoard.length || (row === i && col === j)) continue;
            if (gBoard[row][col].isMine || gBoard[row][col].isShown || gBoard[row][col].isMarked) continue;
            recursiveOpenCells(row, col);
        }
    }
}