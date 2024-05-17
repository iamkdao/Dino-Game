//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino's defaults
let dinoWidth = 70;
let dinoHeight = 80;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

//sprite array
let spriteArray = [];

//small cacti
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 55;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//large cacti
let cactusLarge1Width = 40;
let cactusLarge2Width = 74;
let cactusLarge3Width = 110;

let cactusLargeHeight = 70;
let cactusLargeY = boardHeight - cactusLargeHeight;

let cactusLarge1Img;
let cactusLarge2Img;
let cactusLarge3Img;

//bird
let birdWidth = 70;
let birdHeight = 55;
let birdX = 700;
let birdY = boardHeight - birdHeight;

let birdImg;


//physics
let velocityX = -9;
let velocityY = 0;
let gravity = .9;

let gameOver = false;
let score = 0;

//function for when window has loaded
window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d");   //for drawing on the board

    //draw initial dino
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);
    srcSprites();

    dinoImg.onload = function() {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    requestAnimationFrame(update);
    setInterval(placeCactus, 1500); //1 cactus every 1 sec
    document.addEventListener("keydown", jumpDino);
}

function srcSprites() {
    dinoImg = new Image();
    dinoImg.src = "img/dino.png";

    cactus1Img = new Image();
    cactus1Img.src = "img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "img/cactus3.png";

    cactusLarge1Img = new Image();
    cactusLarge1Img.src = "img/big-cactus1.png";

    cactusLarge2Img = new Image();
    cactusLarge2Img.src = "img/big-cactus2.png";

    cactusLarge3Img = new Image();
    cactusLarge3Img.src = "img/big-cactus3.png";

    birdImg = new Image();
    birdImg.src = "img/bird1.png";

}

/**
 * function to update the dino and sprites
 * the dino & sprites get drawn after every frame
 */
function update() {
    requestAnimationFrame(update);

    if(gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);
    

    //dino
    velocityY += gravity;       //max height should be around 105
    dino.y = Math.min(dino.y + velocityY, dinoY);   //make sure dino doesn't touch ground
    if(dino.y == dinoY){
        runDino();
    }
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for(i = 0; i < spriteArray.length; i++) {
        let cactus = spriteArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if(detectCollision(dino, cactus)) {
            context.clearRect(dino.x, dino.y, dino.width, dino.height);
            dinoImg.src = "img/sonic-dead.png";
            context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            gameOver = true;
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
    increaseSpeed();
}

let lastDinoImageChangeTime = 0; // Variable to store the last time the dino image was changed
let dinoImageChangeInterval = 50; // Interval between dino image changes in milliseconds

function runDino() {
    if(gameOver) {
        
        return;
    }
    // Get the current time
    let currentTime = Date.now();

    // Check if enough time has passed since the last image change
    if (currentTime - lastDinoImageChangeTime >= dinoImageChangeInterval) {
        // Update the last image change time
        lastDinoImageChangeTime = currentTime;

        // Toggle between dino images
        if(dinoImg.src.includes("img/sonic-run4.png")) {
            dinoImg.src = "img/sonic-run1.png";
        }
        else if(dinoImg.src.includes("img/sonic-run1.png")) {
            dinoImg.src = "img/sonic-run2.png";
        }
        else if(dinoImg.src.includes("img/sonic-run2.png")) {
            dinoImg.src = "img/sonic-run3.png";
        }
        else {
            dinoImg.src = "img/sonic-run4.png";
        }
    }
}

function jumpDino(e) {
    if(gameOver) {
        return;
    }

    //check for space or arrow key and the dino's on the ground
    if((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        dinoImg.src = "img/sonic-jump.png";
        velocityY = -15;
    }
}

function increaseSpeed() {
    if(score > 1000) {
        velocityX -= 0.01;
    }
    if(score > 1500) {
        velocityX -= 0.01;
    }
    if(score > 2000) {
        velocityX -= 0.01;
    }
}

function placeCactus() {
    if(gameOver) {
        return;
    }

    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let bird = {
        img: birdImg,
        x: birdX,
        y: birdY,
        width: birdWidth,
        height: birdHeight
    }

    let placeRandom = Math.random();    //from 0 -> 0.9999
    let randomSize = Math.random();

    if(placeRandom > 0.90) {
        if(randomSize < 0.50) {
            cactus.img = cactus3Img;
            cactus.width = cactus3Width;
            spriteArray.push(cactus);
        }
        else {
            cactus.img = cactusLarge3Img;
            cactus.width = cactusLarge3Width;
            cactus.height = cactusLargeHeight;
            cactus.y = cactusLargeY;
            spriteArray.push(cactus);
        }
    }
    else if(placeRandom > 0.70) {
        if(randomSize < 0.50) {
            cactus.img = cactus2Img;
            cactus.width = cactus2Width;
            spriteArray.push(cactus);
        }
        else {
            cactus.img = cactusLarge2Img;
            cactus.width = cactusLarge2Width;
            cactus.height = cactusLargeHeight;
            cactus.y = cactusLargeY;
            spriteArray.push(cactus);
        }
    }
    else if(placeRandom > 0.25) {
        if(randomSize < 0.50) {
            cactus.img = cactus1Img;
            cactus.width = cactus1Width;
            spriteArray.push(cactus);
        }
        else {
            cactus.img = cactusLarge1Img;
            cactus.width = cactusLarge1Width;
            cactus.height = cactusLargeHeight;
            cactus.y = cactusLargeY;
            spriteArray.push(cactus);
        }
    }
    else if(placeRandom > 0.10) {
        spriteArray.push(bird);
    }

    if(spriteArray.length > 3) {
        spriteArray.shift();    //removes the first cactus in array
    }

}

function detectCollision(dino, cactus) {
    return dino.x < cactus.x + cactus.width &&
        dino.x + dino.width > cactus.x && 
        dino.y + dino.height > cactus.y &&
        dino.y < cactus.y + cactus.height;
}