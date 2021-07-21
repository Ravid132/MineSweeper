'use strict'

// const FLAG = 'F';
// const MINE = 'M';

const MINE = '💣';
const FLAG = '🚩';


function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>';
    var className;
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            // var cell = mat[i][j];
            //  var className = 'cell cell' + i + '-' + j;
            var cellValue = '';
            if (board[i][j].isShown) {
                className = 'reveal';
                if (board[i][j].isMine) cellValue = MINE;
                else if (board[i][j].minesAroundCount !== 0) cellValue = board[i][j].minesAroundCount
            } else {
                className = 'hide';
                if (board[i][j].isMarked) cellValue = FLAG;
            }
            // strHTML += `<td class="${className}" data-i="${i}" data-j="${j}" onclick="cellClicked(${i},${j})" //do i need data?
            strHTML += `<td class="${className}" onclick="cellClicked(${i},${j})" 
             oncontextmenu="cellMarked(${i},${j})" >${cellValue}</td>`
            //  oncontextmenu="cellMarked(${cell})">${cellValue}</td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    console.log(elBoard);
}

function revealMines() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
        }
    }
    renderBoard(gBoard);
}

function revealHint(pos) {
    var hintedCells = [];
    for (var i = pos.i - 1; i <= pos.i + 1 && i < gLevel.SIZE; i++) {
        if (i < 0) continue;
        for (var j = pos.j - 1; j <= pos.j + 1 && j < gLevel.SIZE; j++) {
            if (j < 0) continue;
            if (!gBoard[i][j].isShown) {
                hintedCells.push({ i: i, j: j });
                gBoard[i][j].isShown = true;
            }
        }
    }
    console.log('hintCells:', hintedCells);
    renderBoard(gBoard);
    setTimeout(hideHint, 1000, hintedCells);
}

function hideHint(hintedCells) {
    for (var i = 0; i < hintedCells.length; i++) {
        var iIdx = hintedCells[i].i;
        var jIdx = hintedCells[i].j;
        gBoard[iIdx][jIdx].isShown = false;
    }
    gGame.isHintOn = false;
    renderBoard(gBoard);
}
