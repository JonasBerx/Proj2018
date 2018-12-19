const canvasWidth = 1000;
const canvasHeight = 700;
const fieldWidth = 500;
const fieldHeight = 500;
const paddingTop = 100;
const paddingLeft = 250;
const spacer = 50;
let grid = [...Array(fieldWidth / spacer)].map(e => Array(fieldHeight / spacer));

let x = 0;
let y = 0;

//IMAGES
let blueStone;
let greenStone;
let orangeStone;
let purpleStone;
let redStone;
let yellowStone;
let selector;
let darkSlate;
let lightSlate;
let background;

//MOVES
let moves = 69;

//SCORE
let score = 0;
let target = 10000;
let start = false;

//AUDIO
let themeSong;
let chain4PrettyGood;
let chain5PewPew;
let epicVictoryRoyal;
let victory = true;


function Stone(color, selected, position){
    this.color = color;
    this.selected = selected;
    this.position = position;
}

function Position(x, y){
    this.x = x;
    this.y = y;
}

function preload(){
    //SET IMAGES
    blueStone = loadImage("images/blueStone.png");
    greenStone = loadImage("images/greenStone.png");
    orangeStone = loadImage("images/orangeStone.png");
    purpleStone = loadImage("images/purpleStone.png");
    redStone = loadImage("images/redStone.png");
    yellowStone = loadImage("images/yellowStone.png");
    selector = loadImage("images/selector.png");
    darkSlate = loadImage("images/darkSlate.png");
    lightSlate = loadImage("images/lightSlate.png");
    background = loadImage("images/background.png");

    //FONTS
    font = loadFont('font/upheavtt.ttf');

}

function setup() {

    textFont(font);
    textSize(20);
    textAlign(CENTER, CENTER);

    createCanvas(canvasWidth, canvasHeight);

    for (let i = 0; i < fieldWidth / spacer; i++) {
        for (let j = 0; j < fieldHeight / spacer; j++) {

            let rng = int(random(6) + 1);

            grid[i][j] = new Stone(rng, false, new Position(i * spacer + paddingLeft, j * spacer + paddingTop));

        }
    }

    themeSong = new sound("sounds/theme.mp3");
    chain4PrettyGood = new sound("sounds/chain4PrettyGood.mp3");
    chain5PewPew = new sound("sounds/chain5Pew.mp3");
    epicVictoryRoyal = new sound("sounds/epicVictoryRoyal.mp3");
    themeSong.play();
    themeSong.volume = 0.2;

}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    };
    this.stop = function(){
        this.sound.pause();
    };
}

function playGround(){

    //STONES
    for (let i = 0; i < grid[0].length; i++) {
        for (let j = 0; j < grid.length; j++) {

            if ((i + j) % 2 !== 0){
                image(darkSlate, grid[i][j].position.x, grid[i][j].position.y, spacer, spacer);
            } else {
                image(lightSlate, grid[i][j].position.x, grid[i][j].position.y, spacer, spacer);
            }

            if (grid[i][j].selected){
                image(selector, grid[i][j].position.x, grid[i][j].position.y, spacer, spacer);
            }

            let stone;

            if (!(grid[i][j].color === 0)){
                switch(grid[i][j].color){
                    case 1:
                        //BLAUW
                        stone = blueStone;
                        break;

                    case 2:
                        //GEEL
                        stone = yellowStone;
                        break;

                    case 3:
                        //ROOD
                        stone = redStone;
                        break;

                    case 4:
                        //PAARS
                        stone = purpleStone;
                        break;

                    case 5:
                        //GROEN
                        stone = greenStone;
                        break;

                    case 6:
                        //ORANJE
                        stone = orangeStone;
                        break;
                }

                image(stone, grid[i][j].position.x + 13, grid[i][j].position.y + 8, 25, 35);

            }
        }
    }

}

function swap(p, q){

    const temp = grid[(p.position.x - paddingLeft) / spacer][(p.position.y - paddingTop) / spacer].color;

    grid[(p.position.x - paddingLeft) / spacer][(p.position.y - paddingTop) / spacer].color = grid[(q.position.x - paddingLeft)/ spacer][(q.position.y - paddingTop) / spacer].color;

    grid[(q.position.x - paddingLeft) / spacer][(q.position.y - paddingTop) / spacer].color = temp;

}

function horizontalChainAt(x, y){

    let amount = 1;
    for (let i = 1; x + i < grid[0].length; ++i) {
        if (x === 9 || grid[x + i][y].color !== grid[x][y].color) {
            break;
        }
        amount++;
    }

   return amount;

}

function verticalChainAt(x, y) {

    let amount = 1;
    for (let i = 1; y + i < grid.length; ++i) {
        if (y === 9 || grid[x][y + i].color !== grid[x][y].color) {
            break;
        }
        amount++;
    }

    return amount;

}

function removeChains() {

    for (let i = 0; i < grid[0].length; i++) {
        for (let j = 0; j < grid.length; j++) {

            let horizontal = horizontalChainAt(i,j);
            let vertical = verticalChainAt(i,j);

            if (start){
                if (horizontal === 3){
                    score += 500;

                }

                if (horizontal === 4){
                    score += 2000;
                    chain4PrettyGood.play();
                }

                if (horizontal === 5){
                    score += 10000;
                    chain5PewPew.play();
                }

                if (vertical === 3){
                    score += 500;

                }

                if (vertical === 4){
                    score += 500;
                    chain4PrettyGood.play();
                }

                if (vertical === 5){
                    score += 500;
                    chain5PewPew.play();
                }

            }

            if (horizontal >= 3){
                for (let k = 0; k < horizontal; k++) {
                    grid[i + k][j].color = 0;
                }
            }

            if (vertical >= 3){
                for (let k = 0; k < vertical; k++) {
                    grid[i][j + k].color = 0;
                }
            }
        }
    }
}

function collapse(){

    for (let i = grid[0].length - 1; i >= 0; i--) {
        for (let j = grid.length - 1; j >= 0; j--) {

            if (j !== 0 && grid[i][j].color === 0){
                swap(grid[i][j], grid[i][j - 1]);
            }

        }
    }
}

function spawn(){
    for (let i = 0; i <= grid[0].length - 1; i++) {
        if (grid[i][0].color === 0){
            grid[i][0].color = int(random(6) + 1);
        }
    }
}

function legalSwap(x, y){

    let legalMove = false;

    if (x < 8 && horizontalChainAt(x, y) >= 3){
        legalMove = true;
    }

    if (x >= 1 && x < 9 &&horizontalChainAt(x - 1, y) >= 3){
        legalMove = true;
    }

    if (x >= 2 && horizontalChainAt(x - 2, y) >= 3){
        legalMove = true;
    }

    if (y < 8 && verticalChainAt(x, y) >= 3){
        legalMove = true;
    }

    if (y >= 1 && y < 9 &&verticalChainAt(x, y -1) >= 3){
        legalMove = true;
    }

    if (y >= 2 && verticalChainAt(x, y -2) >= 3){
        legalMove = true;
    }

    return legalMove;

}

function drawWords(){
    text("MOVES", 235, 40);
    text(moves, 235, 60);
    text("SCORE", 500, 40);
    text(score, 500, 60);
    text("TARGET", 790, 40);
    text(target, 790, 60)
}

function draw() {

    image(background, 0, 0, canvasWidth, canvasHeight);

    drawWords();
    removeChains();
    collapse();
    spawn();
    playGround();

    if (score >= target && victory){
        themeSong.stop();
        epicVictoryRoyal.play();
        victory = false;
    }

    if (moves === 0 && score < target){

    }

    if (mouseIsPressed){

        start = true;

        let oldX = x;
        let oldY = y;

        if (int((mouseX - paddingLeft) / spacer) < 10 && int((mouseY - paddingTop) / spacer) < 10){

            let foo = false;

            let newX = int((mouseX - paddingLeft) / spacer);
            let newY = int((mouseY - paddingTop) / spacer);

            if (newX !== 9 && grid[newX + 1][newY].selected === true){
                foo = true;
            }
            if (newX !== 0 && grid[newX - 1][newY].selected === true){
                foo = true;
            }
            if (newY !== 9 && grid[newX][newY + 1].selected === true){
                foo = true;
            }
            if (newY !== 0 && grid[newX][newY - 1].selected === true){
                foo = true;
            }

            if (foo){
                grid[oldX][oldY].selected = false;
                grid[newX][newY].selected = false;
                swap(grid[oldX][oldY], grid[newX][newY]);

                moves--;

                let foo = false;

                if (legalSwap(oldX, oldY)){
                    foo = true;
                }

                if (legalSwap(newX, newY)){
                    foo = true;
                }

                if (!foo){
                    swap(grid[oldX][oldY], grid[newX][newY]);
                    moves++;
                }

            }else{
                grid[oldX][oldY].selected = false;
                grid[newX][newY].selected = true;
            }

            x = newX;
            y = newY;

        }

    }


}