let boardWidth = 500;
let boardHeight = 500;
let canvas = document.getElementById('canvas');
let score = document.querySelector('p')
let context = canvas.getContext("2d");

let player = {
    x: 200,
    y: 490,
    width: 100,
    height: 10,
    color: 'red',
    playerScore:0,
    draw: function(){
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}


let bricks = [];
function createBricks() {
    bricks = []; // Reset bricks array
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 6; j++) {
            bricks.push({
                x: 8 + j * 81, // Adjusted for better placement
                y: 50 + i * 30,  // Adjusted for better placement
                width: 70,
                height: 12,
                color: 'lightblue',
                break:true,
                draw: function(){
                    context.fillStyle = this.color;
                    context.fillRect(this.x, this.y, this.width, this.height);
                }
            });
        }
    }
}

let ball = {
    x: 250,
    y: 250,
    width: 10,
    height: 10,
    color: 'white',
    velocityX: 3,
    velocityY: 2,
    draw: function(){
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);

        // Move the ball
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Bounce off the left and right boundaries
        if (this.x <= 0 || this.x + this.width >= boardWidth) {
            this.velocityX *= -1;
        }
        // Bounce off the top boundary
        if (this.y <= 0) {
            this.velocityY *= -1;
        }
        // Bounce off the bottom boundary (game over)
        if (this.y + this.height >= boardHeight) {
            GameOver();
        }
        // Bounce off the player's paddle
        if (this.y + this.height >= player.y && this.x >= player.x && this.x <= player.x + player.width) {
            this.velocityY *= -1;
        }

        // Bounce off the bricks
        for (let i = 0; i < bricks.length; i++) {
            let brick = bricks[i];
            if (brick.break) {
                if (
                    this.x <= brick.x + brick.width &&
                    this.x + this.width >= brick.x &&
                    this.y <= brick.y + brick.height &&
                    this.y + this.height >= brick.y
                ) {
                    this.velocityY *= -1;
                    brick.break = false;
                    brick.x = -20; // Move brick off the screen
                    brick.y = -20;
                   let newScore =   ++player.playerScore;
                    score.innerHTML = "Score:" + newScore 
                }
            }
        }
    }
}

let gameLoop;
let isGameOver = false;

window.onload = () => {
    canvas.width = boardWidth;
    canvas.height = boardHeight;
    canvas.style.backgroundColor = 'black';
    startGame();

    document.addEventListener('keydown', movePlayer);
    canvas.addEventListener('click', restartGame);
}

const update = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    ball.draw();

    // Draw bricks
    for (let brick of bricks) {
        brick.draw();
    }


    if (!isGameOver) {
        requestAnimationFrame(update);
    }
}

function movePlayer(e) {
    if (e.code == "ArrowLeft") {
        player.x = player.x - 10;
    } else if (e.code == "ArrowRight") {
        player.x = player.x + 10;
    }
    // Ensure the player doesn't move out of the canvas boundaries
    player.x = Math.max(0, Math.min(player.x, boardWidth - player.width));
}

const GameOver = () => {
    cancelAnimationFrame(gameLoop);
    isGameOver = true;
    context.fillStyle = 'white';
    context.font = '30px Arial';
    context.fillText('Game Over', boardWidth / 2 - 75, boardHeight / 2);
}

const restartGame = () => {
    if (isGameOver) {
        isGameOver = false;
        player.playerScore = 0;
        score.textContent = 'Score: 0';
        startGame();
    }
}

const startGame = () => {
    player.x = 200;
    ball.x = 250;
    ball.y = 250;
    ball.velocityX = 3;
    ball.velocityY = 2;
    createBricks();
    gameLoop = requestAnimationFrame(update);
}
