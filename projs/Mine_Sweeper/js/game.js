'use strict';

var MINE = '<img class="mine" src="img/mine.png">';
var NORMAL_SMILE = '😀'
var DEAD_SMILE = '😇'
var VICTORY_SMILE = '😎';
var OPEN_SMILE = '😮';
var FLAG = '<img class="flag" src="img/flag.png">';
var NOT_MINE = '<img class="not-mine" src="img/not-mine.png">';

var firstClickIdx;
var firstClick = false;
var gBoard;
var gameInterval;
var emojiInterval;

var gGame = {
    isOn: true,      // isOn – boolean, when true we let the user play
    showCount: 0,    // shownCount: how many cells are shown
    marketCount: 0,  // markedCount: how many cells are marked (with a flag)
    secPassed: 0,    // secsPassed: how many seconds passed
    startTimestamp: 0,
    minesCoordination: new Array(),
    mineCount: 0,
    safeCells: 0,
    foundSaveCells: 0,
    isPlayerWon: false,
    hints: 3
}

// User chooses, level and  gLevel value changes according to choice  
var gLevel = {
    SIZE: 4,
    MINES: 2
}

// standard level configurations
var gLevelOption = {
    'beginner': {
        SIZE: 4,
        MINES: 2
    },
    'medium': {
        SIZE: 6,
        MINES: 5
    },
    'expert': {
        SIZE: 8,
        MINES: 15
    }
};
function chooseLevel(elButton) {
    var chooseLevel = elButton.getAttribute('data-value');

    gLevel.SIZE = gLevelOption[chooseLevel].SIZE;
    gLevel.MINES = gLevelOption[chooseLevel].MINES;
    initGame()
}

function newGame() {
    initGame();
}


// This is called when page loads
function initGame() {
    gGame.isOn = true;
    gGame.foundSaveCells = 0;
    firstClick = false;
    //firstClickIdx.length = 0;
    gGame.isPlayerWon = false;
    gGame.minesCoordination.length = 0;
    clearInterval(gameInterval);
    gBoard = buildBoard();
    gGame.safeCells = (gLevel.SIZE ** 2) - gLevel.MINES;
    renderBoard(gBoard);
    gGame.hints = 3;
}
// Builds the board   Set mines at random locations Call setMinesNegsCount() Return the created board 
function buildBoard() {
    var board = [];
    for (let i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (let j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = createCell(i, j, false, 0);
        }
    }
    return board;
}

function createCell(i, j, isMine, minesAroundCount) {
    var cellContent = {
        minesAroundCount: minesAroundCount,
        location: {
            i: i,
            j: j
        },
        isShow: false,
        isMine: isMine,
        isMarket: false,
        isHint: false
    };
    return cellContent;
}

// Sets mine's count to mine's neighbors
function setMinesNegsCount(location) {
    if (gBoard[location.i][location.j].isMine) return;

    var sum = 0;
    var coords = [
        { i: location.i - 1, j: location.j - 1 },
        { i: location.i - 1, j: location.j },
        { i: location.i - 1, j: location.j + 1 },
        { i: location.i, j: location.j - 1 },
        { i: location.i, j: location.j + 1 },
        { i: location.i + 1, j: location.j - 1 },
        { i: location.i + 1, j: location.j },
        { i: location.i + 1, j: location.j + 1 }
    ];
    // [[-1, -1], [-1, 0], [-1, 1],
    //  [0, -1],check cell, [0, 1],
    //  [1, -1],  [1, 0],  [1, 1]];
    for (var idx = 0; idx < coords.length; idx++) {
        var iCord = coords[idx].i;
        var jCord = coords[idx].j;
        var location = {
            i: iCord,
            j: jCord
        };
        if (inBounds(location) && (gBoard[location.i][location.j].isMine)) {
            sum++;
        }
    }
    return sum;
}

function createMines() {
    for (let i = 0; i < gLevel.MINES; i++) {
        var notFindFirstCell = true;
        while (notFindFirstCell) {
            var location = {
                i: randomNum(0, gBoard.length - 1),
                j: randomNum(0, gBoard.length - 1)
            };

            if (location.i !== firstClickIdx[0] && location.j !== firstClickIdx[1]) {
                //Because random can reapeted the same coordination we do below check
                if (gBoard[location.i][location.j].isMine === false) {
                    gBoard[location.i][location.j].isMine = true;
                    gGame.minesCoordination.push(location);
                    notFindFirstCell = false;
                    //renderCell(location, MINE);
                    break;
                }
            }
        }
    }
    gGame.mineCount = gGame.minesCoordination.length;
}

function displayAllMines() {
    //var elements = document.getElementsByClassName('mine');

    if (!gGame.isPlayerWon) {
        placeImgInAllMineCoord(MINE);
        checkWrongFlagLocation();
        updateMineCount(0);
    } else { //If player Win
        for (let i = 0; i < gGame.minesCoordination.length; i++) {
            placeImgInAllMineCoord(FLAG);
            updateMineCount(0);
        }
    }
}

function placeImgInAllMineCoord(img) {
    for (let i = 0; i < gGame.minesCoordination.length; i++) {
        var iCoord = gGame.minesCoordination[i].i;
        var jCord = gGame.minesCoordination[i].j;
        document.querySelector(`.cell${iCoord}-${jCord}`).innerHTML = img;
    }
}

function checkWrongFlagLocation() {
    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMarket && !gBoard[i][j].isMine) {
                var elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.innerHTML = NOT_MINE;
                elCell.style.backgroundColor = 'white';
            }
        }
    }
}

// Render the board as a <table> to the page 
function renderBoard(board) {
    var strHTML = `<table border="0"><thead>
    <tr>
      <th colspan="1"><div class="mines-count">0💣</div></th>
      <th onclick="newGame()" colspan="${gBoard.length - 2}" class="emoji"><abbr title='Press to start again'>${NORMAL_SMILE}</abbr></th>
      <th colspan="1"><div class="stopwatch">0</div>s</th>
    </tr>
  </thead><tbody>`;
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            cell.isShow = false;
            var className = `cell cell${i}-${j}`;
            strHTML += `<td class="${className}" onclick='cellClicked(this, ${i}, ${j})'
            oncontextmenu ='cellMarked(this, ${i}, ${j})'">
            </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += `<tfoot>
                <tr>
                    <td colspan="${gBoard.length}" class="hints">Hints</td>
                </tr>
                </tfoot>'</tbody></table>`;
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}


//Called when a cell (td) is clicked
function cellClicked(elCell, i, j) {
    if (!gGame.isOn || gBoard[i][j].isMarket) return;
    document.querySelector('.emoji').innerHTML = OPEN_SMILE;
    if (!gBoard[i][j].isMine) {
        emojiInterval = setTimeout(function () {
            document.querySelector('.emoji').innerHTML = NORMAL_SMILE;
        }, 300);
    }
    if (!firstClick) {
        startStopWatch();
        addHintToDOS();
        firstClick = true;
        firstClickIdx = [i, j];
        createMines();
        updateMineCount(gGame.mineCount);
        expandShown(gBoard, i, j);
    } else if (gBoard[i][j].isMine) {
        elCell.style.backgroundColor = 'red';
        checkGameOver(gGame.isPlayerWon);
    } else {
        expandShown(gBoard, i, j);
    }
}

// Called on right click to mark a cell (suspected to be a mine) 
function cellMarked(elCell, i, j) {
    if (!firstClick) {
        startStopWatch();
        addHintToDOS();
        firstClick = true;
        firstClickIdx = [i, j];
        createMines();
        updateMineCount(gGame.mineCount);
    }
    if (gBoard[i][j].isShow) return;
    if (!gGame.isOn) return;
    if (gBoard[i][j].isMarket) {
        elCell.innerHTML = '';
        gBoard[i][j].isMarket = false;
        gGame.mineCount++;
        updateMineCount(gGame.mineCount);
    } else {
        elCell.innerHTML = FLAG;
        gBoard[i][j].isMarket = true;
        gGame.mineCount--;
        updateMineCount(gGame.mineCount);
    }
}


function updateMineCount(count) {
    document.querySelector('.mines-count').innerHTML = count + '💣';
}
//Game ends when all mines are marked and all the other cells are shown 
function checkGameOver(isWon) {
    if (isWon) {
        document.querySelector('.emoji').innerHTML = VICTORY_SMILE;
        console.log('Player Won the game');
    } else {
        document.querySelector('.emoji').innerHTML = DEAD_SMILE;
        console.log('Player Lose the game');
    }
    gGame.isOn = false;
    displayAllMines();
    clearInterval(gameInterval);
    clearTimeout(emojiInterval);
}

function inBounds(location) {
    return (location.i >= 0 && location.i < gLevel.SIZE && location.j >= 0 && location.j < gLevel.SIZE) ? true : false;
}

//When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors
function expandShown(board, i, j) {
    var location = {
        i: board[i][j].location.i,
        j: board[i][j].location.j
    };
    search(location, false);
}

function search(location, isHint) {
    if (!(inBounds(location))) return;
    var cell = gBoard[location.i][location.j];
    if (cell.isShow || cell.isMine || cell.isMarket) return;
    if (!isHint) {
        gGame.foundSaveCells += 1;
    } else {
        cell.isHint = true;
    }
    cell.isShow = true;
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.style.backgroundColor === 'white' ? elCell.style.backgroundColor === '#9e9e9e' : elCell.style.backgroundColor = 'white';
    var sum = setMinesNegsCount(location);
    if (gGame.foundSaveCells === gGame.safeCells && !isHint) {
        checkGameOver(gGame.isPlayerWon = true);
    }
    if (sum > 0) {
        cell.minesAroundCount = sum;
        renderCell(location, sum);
        return;
    }

    var coords = [
        { i: location.i - 1, j: location.j - 1 },
        { i: location.i - 1, j: location.j },
        { i: location.i - 1, j: location.j + 1 },
        { i: location.i, j: location.j - 1 },
        { i: location.i, j: location.j + 1 },
        { i: location.i + 1, j: location.j - 1 },
        { i: location.i + 1, j: location.j },
        { i: location.i + 1, j: location.j + 1 }
    ];
    // [[-1, -1], [-1, 0], [-1, 1],
    //  [0, -1],check cell, [0, 1],
    //  [1, -1],  [1, 0],  [1, 1]];
    for (var idx = 0; idx < coords.length; idx++) {
        var iCord = coords[idx].i;
        var jCord = coords[idx].j;
        var location = {
            i: iCord,
            j: jCord
        };
        search(location, isHint);
    }
}

function addHintToDOS() {
    var elHints = document.querySelector('.hints');
    var strHTML = '';
    for (let i = 0; i < gGame.hints; i++) {
        strHTML += '<img class="hint" src="img/lamp.png" onclick="showHints(this)">';
    }
    elHints.innerHTML = strHTML;
}

function showHints(elHint) {
    var notFindFreeCell = true;
    
    while (notFindFreeCell) {
        var i = randomNum(0, gBoard.length - 1);
        var j = randomNum(0, gBoard.length - 1);
        var cell = gBoard[i][j];
        var location = {
            i: i,
            j: j
        };

        if (!(cell.isMarket || cell.isMine || cell.isShow)) {
            //debugger
            search(location, true);
            notFindFreeCell = false;
            setTimeout(clearHintsCell, 1000);
            gGame.hints -= 1
            break;
        }
    }
    elHint.remove();
}

function clearHintsCell() {
    for (let i = 0; i < gLevel.SIZE; i++) {
        for (let j = 0; j < gLevel.SIZE; j++) {
            var hintCell = gBoard[i][j];
            if (hintCell.isHint) {
                var elCell = document.querySelector(`.cell${i}-${j}`);
                elCell.style.backgroundColor = '#9e9e9e';
                renderCell(hintCell.location, '');
                hintCell.isHint = false;
                hintCell.isShow = false;
            }
        }
    }
}
