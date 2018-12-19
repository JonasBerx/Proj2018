// Animation variables
var animationstate = 0;
var animationtime = 0;
var animationtimetotal = 0.3;

// Swap two tiles as a player action
function mouseSwap(c1, r1, c2, r2) {
    // Save the current move
    currentmove = {column1: c1, row1: r1, column2: c2, row2: r2};

    // Deselect
    level.selectedtile.selected = false;

    // Start animation
    animationstate = 2;
    animationtime = 0;
    gamestate = gamestates.resolve;
}
// Initialize the two-dimensional tile array
for (var i=0; i<level.columns; i++) {
    level.tiles[i] = [];
    for (var j=0; j<level.rows; j++) {
        // Define a tile type and a shift parameter for animation
        level.tiles[i][j] = { type: 0, shift:0 }
    }
}
// Main loop
function main(tframe) {
    // Request animation frames
    window.requestAnimationFrame(main);

    // Update and render the game
    update(tframe);
    render();
}

// Let the AI bot make a move, if enabled
if (aibot) {
    animationtime += dt;
    if (animationtime > animationtimetotal) {
        // Check if there are moves available
        findMoves();

        if (moves.length > 0) {
            // Get a random valid move
            var move = moves[Math.floor(Math.random() * moves.length)];

            // Simulate a player using the mouse to swap two tiles
            mouseSwap(move.column1, move.row1, move.column2, move.row2);
        } else {
            // No moves left, Game Over. We could start a new game.
            // newGame();
        }
        animationtime = 0;
    }
}
} else if (gamestate == gamestates.resolve) {
    // Game is busy resolving and animating clusters
    animationtime += dt;

    if (animationstate == 0) {
        // Clusters need to be found and removed
        if (animationtime > animationtimetotal) {
            // Find clusters
            findClusters();

            if (clusters.length > 0) {
                // Add points to the score
                for (var i=0; i<clusters.length; i++) {
                    // Add extra points for longer clusters
                    score += 100 * (clusters[i].length - 2);;
                }

                // Clusters found, remove them
                removeClusters();

                // Tiles need to be shifted
                animationstate = 1;
            } else {
                // No clusters found, animation complete
                gamestate = gamestates.ready;
            }
            animationtime = 0;
        }
    } else if (animationstate == 1) {
        // Tiles need to be shifted
        if (animationtime > animationtimetotal) {
            // Shift tiles
            shiftTiles();

            // New clusters need to be found
            animationstate = 0;
            animationtime = 0;

            // Check if there are new clusters
            findClusters();
            if (clusters.length <= 0) {
                // Animation complete
                gamestate = gamestates.ready;
            }
        }
    } else if (animationstate == 2) {
        // Swapping tiles animation
        if (animationtime > animationtimetotal) {
            // Swap the tiles
            swap(currentmove.column1, currentmove.row1, currentmove.column2, currentmove.row2);

            // Check if the swap made a cluster
            findClusters();
            if (clusters.length > 0) {
                // Valid swap, found one or more clusters
                // Prepare animation states
                animationstate = 0;
                animationtime = 0;
                gamestate = gamestates.resolve;
            } else {
                // Invalid swap, Rewind swapping animation
                animationstate = 3;
                animationtime = 0;
            }

            // Update moves and clusters
            findMoves();
            findClusters();
        }
    } else if (animationstate == 3) {
        // Rewind swapping animation
        if (animationtime > animationtimetotal) {
            // Invalid swap, swap back
            swap(currentmove.column1, currentmove.row1, currentmove.column2, currentmove.row2);

            // Animation complete
            gamestate = gamestates.ready;
        }
    }

    // Update moves and clusters
    findMoves();
    findClusters();
}

// Draw score
context.fillStyle = "#000000";
context.font = "24px Verdana";
drawCenterText("Score:", 30, level.y+40, 150);
drawCenterText(score, 30, level.y+70, 150);


function renderTiles() {
    for (var i = 0; i < level.columns; i++) {
        for (var j = 0; j < level.rows; j++) {
            // Get the shift of the tile for animation
            var shift = level.tiles[i][j].shift;

            // Calculate the tile coordinates
            var coord = getTileCoordinate(i, j, 0, (animationtime / animationtimetotal) * shift);

            // Check if there is a tile present
            if (level.tiles[i][j].type >= 0) {
                // Get the color of the tile
                var col = tilecolors[level.tiles[i][j].type];

                // Draw the tile using the color
                drawTile(coord.tilex, coord.tiley, col[0], col[1], col[2]);
            }

            // Draw the selected tile
            if (level.selectedtile.selected) {
                if (level.selectedtile.column == i && level.selectedtile.row == j) {
                    // Draw a red tile
                    drawTile(coord.tilex, coord.tiley, 255, 0, 0);
                }
            }
        }
    }
}
// Render the swap animation
if (gamestate == gamestates.resolve && (animationstate == 2 || animationstate == 3)) {
    // Calculate the x and y shift
    var shiftx = currentmove.column2 - currentmove.column1;
    var shifty = currentmove.row2 - currentmove.row1;

    // First tile
    var coord1 = getTileCoordinate(currentmove.column1, currentmove.row1, 0, 0);
    var coord1shift = getTileCoordinate(currentmove.column1, currentmove.row1, (animationtime / animationtimetotal) * shiftx, (animationtime / animationtimetotal) * shifty);
    var col1 = tilecolors[level.tiles[currentmove.column1][currentmove.row1].type];

    // Second tile
    var coord2 = getTileCoordinate(currentmove.column2, currentmove.row2, 0, 0);
    var coord2shift = getTileCoordinate(currentmove.column2, currentmove.row2, (animationtime / animationtimetotal) * -shiftx, (animationtime / animationtimetotal) * -shifty);
    var col2 = tilecolors[level.tiles[currentmove.column2][currentmove.row2].type];

    // Draw a black background
    drawTile(coord1.tilex, coord1.tiley, 0, 0, 0);
    drawTile(coord2.tilex, coord2.tiley, 0, 0, 0);

    // Change the order, depending on the animation state
    if (animationstate == 2) {
        // Draw the tiles
        drawTile(coord1shift.tilex, coord1shift.tiley, col1[0], col1[1], col1[2]);
        drawTile(coord2shift.tilex, coord2shift.tiley, col2[0], col2[1], col2[2]);
    } else {
        // Draw the tiles
        drawTile(coord2shift.tilex, coord2shift.tiley, col2[0], col2[1], col2[2]);
        drawTile(coord1shift.tilex, coord1shift.tiley, col1[0], col1[1], col1[2]);
    }
}
function mouseSwap(c1, r1, c2, r2) {
    // Save the current move
    currentmove = {column1: c1, row1: r1, column2: c2, row2: r2};

    // Deselect
    level.selectedtile.selected = false;

    // Start animation
    animationstate = 2;
    animationtime = 0;
    gamestate = gamestates.resolve;
}