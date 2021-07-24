'use strict'

const SCORE = -1;

initLocalStorage();
renderScore('easy');
function initLocalStorage() {
    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        if (window.localStorage.easyScore <= 0 || !window.localStorage.easyScore) window.localStorage.setItem('easyScore', SCORE)
        if (window.localStorage.mediumScore <= 0 || !window.localStorage.mediumScore) window.localStorage.setItem('mediumScore', SCORE)
        if (window.localStorage.expertScore <= 0 || !window.localStorage.expertScore) window.localStorage.setItem('expertScore', SCORE)
    } else {
        // Sorry! No Web Storage support..
        console.log('Sorry! no web storage support...');
    }
}

function highestScore(level, score) {
    console.log('newScore', score);
    switch (level) {
        case 'easy':
            if (score < window.localStorage.easyScore || window.localStorage.easyScore <= 0) {
                window.localStorage.easyScore = score;
            }
            break;
        case 'medium':
            if (score < window.localStorage.mediumScore || window.localStorage.mediumScore <= 0) {
                window.localStorage.mediumScore = score;
            }
            break;
        case 'expert':
            if (score < window.localStorage.expertScore || window.localStorage.expertScore <= 0) {
                window.localStorage.expertScore = score;
            }
            break;

        default:
            break;
    }
    renderScore(level)
}

function renderScore(level) {
    var currScore = Number.parseInt(window.localStorage.getItem(level + 'Score'));
    var elScore = document.querySelector('.score');
    if (currScore <= 0 || isNaN(currScore)) elScore.innerText = ' no high score yet'
    else elScore.innerText = level + ' score ' + currScore;

}