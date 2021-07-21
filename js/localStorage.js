'use strict'

const SCORE = 100000000;

initLocalStorage();
document.querySelector('.score').innerText = 0;

function initLocalStorage() {
    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        if (!localStorage.easyScore) localStorage.easyScore = SCORE;
        if (!localStorage.mediumScore) localStorage.mediumScore = SCORE;
        if (!localStorage.expertScore) localStorage.expertScore = SCORE;
    } else {
        // Sorry! No Web Storage support..
        console.log('Sorry! no web storage support...');
    }
}

function highestScore(level, score) {
    console.log(score);
    switch (level) {
        case 'easy':
            if (score < localStorage.easyScore) {
                localStorage.easyScore = score;
            }
            break;
        case 'medium':
            if (score < localStorage.mediumScore) {
                localStorage.mediumScore = score;
            }
            break;
        case 'expert':
            if (score < localStorage.expertScore) {
                localStorage.expertScore = score;
            }
            break;

        default:
            break;
    }
    document.querySelector('.score').innerText = score;

}