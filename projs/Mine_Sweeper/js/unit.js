function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startStopWatch() {
    gGame.startTimestamp = Date.now();
    gameInterval = setInterval(updateStopWatch, 1000);
}
//update the stopwatch class with relevant date
function updateStopWatch() {
    gGame.secPassed = parseInt((Date.now() - gGame.startTimestamp) / 1000)
    document.querySelector('.stopwatch').innerHTML = gGame.secPassed;
}