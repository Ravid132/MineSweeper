'use strict'

// const FLAG = 'F';
// const MINE = 'M';

const MINE = '💣';
const FLAG = '🚩';

//reveal mines
function revealMines() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
        }
    }
    renderBoard(gBoard);
}

//reveal hint
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
    renderBoard(gBoard);
    setTimeout(hideHint, 1000, hintedCells);
}

//hide hint
function hideHint(hintedCells) {
    for (var i = 0; i < hintedCells.length; i++) {
        var iIdx = hintedCells[i].i;
        var jIdx = hintedCells[i].j;
        gBoard[iIdx][jIdx].isShown = false;
    }
    gGame.isHintOn = false;
    renderBoard(gBoard);
}
