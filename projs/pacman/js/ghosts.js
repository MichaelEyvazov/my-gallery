var GHOST = '<img class="ghosts" src="img/ghost.png">';

var gIntervalGhosts;
var gGhosts;
var gGhostsIdx = [1, 2, 3, 4];

function createGhost(board) {
    var id = gGhostsIdx.shift();
    var color = getRandomColor();
    var ghost = {
        id: id,
        location: {
            i: 3,
            j: 3
        },
        currCellContent: FOOD,
        color: color,
        img: `<img class="ghosts" style="background-color:${color}" src="img/ghost.png">`
    };
    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;
}


function createGhosts(board) {
    // Empty the gGhosts array, create some ghosts
    gGhosts = [];

    createGhost(board)
    createGhost(board)
    createGhost(board)
    createGhost(board)

    // Run the interval to move them
    gIntervalGhosts = setInterval(moveGhosts, 1000)
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];

        // Create the moveDiff
        var moveDiff = getMoveDiff();
        // console.log('moveDiff', moveDiff);
        var nextLocation = {
            i: ghost.location.i + moveDiff.i,
            j: ghost.location.j + moveDiff.j,
        }
        // console.log('nextLocation', nextLocation);

        var nextCell = gBoard[nextLocation.i][nextLocation.j]
        // If WALL return
        if (nextCell === GHOST) {
            console.log('Ghost Hitting a GHOST');
            return;
        }
        if (nextCell === WALL) {
            console.log('Ghost Hitting a Wall');
            return;
        }
        // DETECT gameOver
        if (nextCell === PACMAN) {
            if (!gPacman.isSuper) gameOver();
            else {
                //debugger
                //TO DO delete the ghost
            }
        }

        // Set back what we stepped on
        gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
        renderCell(ghost.location, ghost.currCellContent);

        // Move the ghost MODEL
        ghost.currCellContent = nextCell;
        ghost.location = nextLocation
        gBoard[ghost.location.i][ghost.location.j] = GHOST;

        // Updade the DOM 
        renderCell(ghost.location, ghost.img)
    }
}

// There are 4 options where to go
function getMoveDiff() {
    // return { i: getRandomIntInclusive(-1, 1), j: getRandomIntInclusive(-1, 1) }
    var opts = [{ i: 0, j: 1 }, { i: 1, j: 0 }, { i: -1, j: 0 }, { i: 0, j: -1 }];
    return opts[getRandomIntInclusive(0, opts.length - 1)];
}


function indexOfGhost(location) {
    for (let i = 0; i < gGhosts.length; i++) {
        let ghost = gGhosts[i];
        if (ghost.location.i === location.i && ghost.location.j === location.j) return i;
    }
    return -1;
}


function changeChostsColor() {
    for (let i = 0; i < gGhosts.length; i++) {
        gGhosts[i].img = `<img class="ghosts" style="background-color:white" src="img/ghost.png">`;
        renderCell(gGhosts[i].location, gGhosts[i].img);
    }
    setTimeout(function () {
        gPacman.isSuper = false;
        for (let i = 0; i < gGhosts.length; i++) {
            gGhosts[i].img = `<img class="ghosts" style="background-color:${gGhosts[i].color}" src="img/ghost.png">`;
            renderCell(gGhosts[i].location, gGhosts[i].img);
        }
    }, 5000);
}







function getGhostHTML(ghost) {
    return `<span>${GHOST}</span>`
}






