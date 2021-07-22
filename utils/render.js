'use strict'

const NORMAL_SMILEY = '😀';
const SAD_SMILEY = '🤯';
const WINNER_SMILEY = '😎';
const LOST_SMILEY = '😱';

//render board b
function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>';
    var className;
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cellValue = '';
            if (board[i][j].isShown) {
                className = 'reveal';
                if (board[i][j].isMine) cellValue = MINE;
                else if (board[i][j].minesAroundCount !== 0) cellValue = board[i][j].minesAroundCount
            } else {
                className = 'hide';
                if (board[i][j].isMarked) cellValue = FLAG;
            }
            // strHTML += `<td class="${className}" data-i="${i}" data-j="${j}" onclick="cellClicked(${i},${j})"
            // oncontextmenu="cellMarked(${i},${j})" >${cellValue}</td>`
            strHTML += `<td class="${className}" data-i="${i}" data-j="${j}" onclick="cellClicked(${i},${j})"
            oncontextmenu="cellMarked(event,${i},${j})" >${cellValue}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

//render hints g
function renderHints() {
    var strHTML = '';
    var elHints = document.querySelector('.hints');
    for (var i = 0; i < gGame.hints; i++) {
        var str = '<span class"hint" onclick="activeHint(this)"> 💡</span>';
        strHTML += str;
    }
    elHints.innerHTML = strHTML;
}

//render lives g
function renderLives() {
    document.querySelector('.lives').innerHTML = 'Lives: ' + gGame.lives;
}

//render smiley g
function renderSmiley(isWinner) {
    var face;
    switch (gGame.lives) {
        case 0:
            face = LOST_SMILEY;
            break;
        case 1:
            face = SAD_SMILEY;
            break;
        case 2:
            face = SAD_SMILEY;
            break;
        case 3:
            face = NORMAL_SMILEY;
            break;
        default:
            break;
    }

    if (isWinner) {
        face = WINNER_SMILEY;
    }
    document.querySelector('.smiley').innerHTML = face;
}