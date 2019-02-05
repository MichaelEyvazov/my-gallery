'use strict';
var WALL = '<img class="wall" src="img/wall.png">';
var FOOD = '<img class="food" src="img/food.png">';
var EMPTY = ' ';
var POWER_FOOD = '<img class="power-food" src="img/superfood.png">'
var CHERRY = '<img class="cherry" src="img/cherry.png">'

var gBoard;
var gFoodCount;
var gIntervalCherry;
var gGame = {
  score: 0,
  isOn: false
};

function init() {
  gFoodCount = 0;
  gBoard = buildBoard();
  createPacman(gBoard);
  createGhosts(gBoard);
  
  printMat(gBoard, '.board-container');
  // console.table(gBoard);
  gGame.isOn = true;
  gIntervalCherry = setInterval(randomCherry, 15000);
}

function buildBoard() {
  var SIZE = 10;
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = FOOD;
      if (i === 0 || i === SIZE - 1 ||
        j === 0 || j === SIZE - 1 ||
        (j === 3 && i > 4 && i < SIZE - 2)) {

        board[i][j] = WALL;
      }
    }
  }
  board[1][1] = POWER_FOOD;
  board[1][SIZE - 2] = POWER_FOOD;
  board[SIZE - 2][1] = POWER_FOOD;
  board[SIZE - 2][SIZE - 2] = POWER_FOOD;
  return board;
}

function countFood() {
  gFoodCount = 0;
  var SIZE = 10;
  for (var i = 0; i < SIZE; i++) {
    for (var j = 0; j < SIZE; j++) {
      if (gBoard[i][j] === FOOD || gBoard[i][j] === POWER_FOOD) {
        gFoodCount++;
      }
    }
  }
  //gFoodCount--;
}

function updateScore(value) {
  // Update both the model and the dom for the score
  gGame.score += value;
  document.querySelector('header h3 span').innerText = gGame.score;
}

function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell' + i + '-' + j;
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function gameOver() {
  console.log('Game Over');
  displayModal('Game Over', gGame.score);
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  clearInterval(gIntervalCherry);
  gIntervalGhosts = 0;
}

function gamerWon() {
  console.log('Gamer Won');
  displayModal('Congratulations You Won', gGame.score);
  gGame.isOn = false;
  clearInterval(gIntervalGhosts);
  gIntervalGhosts = 0;
}

function displayModal(header, score) {
  document.querySelector('header').style.display = 'none';
  var strHTML = `<h1 align="center">${header}</h1>
  <p>Your score is: ${score}</p>
  <button class="play-again"onclick="playAgain()">
                    Play again 😄</a>
                </button>`;
  var elModal = document.querySelector('.modal');

  elModal.style.display = 'block';
  document.querySelector('.board-container').style.display = 'none';
  elModal.innerHTML = strHTML;
}

function playAgain() {
  document.querySelector('.board-container').style.display = 'block';
  document.querySelector('header').style.display = 'block';
  document.querySelector('.modal').style.display = 'none';
  gGame.score = 0;
  init();
}

function randomCherry() {
  var location = {
    i: getRandomIntInclusive(1, gBoard.length - 2),
    j: getRandomIntInclusive(1, gBoard.length - 2)
  };
  if (gBoard[location.i][location.j] === EMPTY) {
    gBoard[location.i][location.j] = CHERRY;
    renderCell(location, CHERRY);
  }
}




