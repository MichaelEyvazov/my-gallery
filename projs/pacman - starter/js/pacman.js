var gPacman;
const PACMAN = '<img class="pacman" src="img/pacman.png">';
// var superPacman = false;

function createPacman(board) {
  gPacman = {
    location: {
      i: 3,
      j: 5
    },
    isSuper: false,
    secondPowerFood: false
  };
  board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(eventKeyboard) {
  if (!gGame.isOn) return;
  // console.log('eventKeyboard:', eventKeyboard);

  var nextLocation = getNextLocation(eventKeyboard);
  // User pressed none-relevant key in the keyboard
  if (!nextLocation) return;

  var nextCell = gBoard[nextLocation.i][nextLocation.j];

  // Hitting a WALL, not moving anywhere
  if (nextCell === WALL) return;
  //Cherry gives you 10 points 
  if (nextCell == CHERRY) {
    updateScore(10);
  }

  if (nextCell === POWER_FOOD) {
    updateScore(1);
    gFoodCount--;
    gPacman.isSuper = true;
    gPacman.secondPowerFood = true;
    changeChostsColor();
  }

  // Hitting FOOD? update score
  if (nextCell === FOOD) {
    updateScore(1);
    gFoodCount--;
  }
  if (nextCell === GHOST) {
    if (gPacman.isSuper) {
      updateScore(5);
      let id = indexOfGhost(nextLocation);
      gGhosts.splice(id, 1);
      setTimeout(function (){ createGhost(gBoard) }, 5000);
    } else {
      gameOver();
      renderCell(gPacman.location, EMPTY);
      return;
    }
  }
  // // Update the model to reflect movement
  // if (gPacman.secondPowerFood) {
  //   gBoard[gPacman.location.i][gPacman.location.j] = POWER_FOOD;
  //   renderCell(gPacman.location, EMPTY);

  // } else {
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
  // Update the DOM
  renderCell(gPacman.location, EMPTY);
  //}

  // Update the pacman MODEL to new location  
  gPacman.location = nextLocation;

  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
  // Render updated model to the DOM
  renderCell(gPacman.location, PACMAN);
  countFood();
  if (gFoodCount === 0) gamerWon();

}

function getNextLocation(keyboardEvent) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j
  };
  switch (keyboardEvent.code) {
    case 'ArrowUp':
      nextLocation.i--;
      break;
    case 'ArrowDown':
      nextLocation.i++;
      break;
    case 'ArrowLeft':
      nextLocation.j--;
      break;
    case 'ArrowRight':
      nextLocation.j++;
      break;
    default: return null;
  }
  return nextLocation;
}

function rotate(ev) {
  var pacman = document.querySelector('.pacman');
  var direction;
  // console.log(ev.code);
  if (!pacman) return;
  switch (ev.code) {
    case 'ArrowUp':
      direction = 'rotate(270deg)'
      break;
    case 'ArrowDown':
      direction = 'rotate(90deg)'
      break;
    case 'ArrowLeft':
      direction = 'rotate(0deg)'
      direction = 'rotateY(180deg)'
      break;
    case 'ArrowRight':
      direction = 'rotate(0deg)'
      break;
    default: return null;
  }
  pacman.style.transform = direction;
}