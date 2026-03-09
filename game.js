// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Clase Ball
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebote arriba y abajo
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;

        this.speedX = (Math.random() * 4) + 2;
        this.speedY = (Math.random() * 4) + 2;

        if (Math.random() > 0.5) this.speedX *= -1;
    }
}

// Clase Paddle
class Paddle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 6;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        }
        if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    autoMove(ball) {
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else {
            this.y += this.speed;
        }
    }
}

// Clase Game
class Game {
    constructor() {

        // 5 pelotas diferentes
        this.balls = [
            new Ball(400, 300, 6, 3, 3, "white"),
            new Ball(300, 200, 8, 4, 3, "orange"),
            new Ball(500, 350, 12, 2, 3, "cyan"),
            new Ball(450, 400, 10, 3, 4, "gray"),
            new Ball(600, 450, 7, 4, 2, "blue")
        ];

        // Paleta jugador (DOBLE DE ALTO)
        this.paddle1 = new Paddle(
            0,
            canvas.height / 2 - 100,
            10,
            200,
            "lime"
        );

        // Paleta CPU
        this.paddle2 = new Paddle(
            canvas.width - 10,
            canvas.height / 2 - 50,
            10,
            100,
            "red"
        );

        this.keys = {};
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.balls.forEach(ball => ball.draw());

        this.paddle1.draw();
        this.paddle2.draw();
    }

    update() {

        // Movimiento jugador
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        // IA sigue la primera pelota
        this.paddle2.autoMove(this.balls[0]);

        // Actualizar cada pelota
        this.balls.forEach(ball => {

            ball.move();

            // Colisión con paleta jugador
            if (
                ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y &&
                ball.y <= this.paddle1.y + this.paddle1.height
            ) {
                ball.speedX = -ball.speedX;
            }

            // Colisión con paleta CPU
            if (
                ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y &&
                ball.y <= this.paddle2.y + this.paddle2.height
            ) {
                ball.speedX = -ball.speedX;
            }

            // Si sale del campo
            if (ball.x < 0 || ball.x > canvas.width) {
                ball.reset();
            }

        });
    }

    handleInput() {

        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });

    }

    run() {

        this.handleInput();

        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };

        gameLoop();
    }
}

// Iniciar juego
const game = new Game();
game.run();