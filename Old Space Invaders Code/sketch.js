
let alienImage; 
let invaders;
let shooterImage;
let player;
function preload() {
    alienImage = loadImage("invaderOG.png");
    shooterImage = loadImage("shooter.png");
}

function setup() {
    createCanvas(400, 400);
    invaders = new Invaders(alienImage, 4);
    player = new Player(shooterImage);
}

function draw() {
    background(0);

    invaders.update(player);
    invaders.draw();

    if (player.lives == 0) {
        setup();
    }
}

function mousePressed() {
    invaders.checkCollision(mouseX, mouseY);
}

// Control Functions - used keycode.info

function keyPressed() {
    if (keyCode === RIGHT_ARROW || keyCode == 39) {
        player.moveRight();
    } else if (keyCode === LEFT_ARROW || keyCode == 37) {
        player.moveLeft();
    } else if (keyCode === 32) {
        player.shoot();
    }
}
