// type apple =
// {
//     context: HTMLElement,
//     color: string
//     position: location
// }
class Apple {
    constructor(_options) {
        this.context = _options.context;
        this.color = _options.color;
        this.position =
            {
                x: _options.x,
                y: _options.y
            };
        this.isEaten = false;
        this.canvasSizes = _options.canvasSizes;
    }
    relocate() {
        this.isEaten = false;
        this.position =
            {
                x: Math.floor(Math.random() * this.canvasSizes.width / 20),
                y: Math.floor(Math.random() * this.canvasSizes.width / 20),
            };
    }
    draw() {
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.arc(this.position.x * 20 + 10, // x
        this.position.y * 20 + 10, // y 
        1 * 8, // radius
        0, // start angle
        Math.PI * 2 // theta
        );
        this.context.fill();
    }
}
class Snake {
    constructor(_options) {
        this.context = _options.context;
        // this.x = _options.x
        // this.y = _options.y
        this.color = _options.color;
        this.apples = _options.apples;
        this.head =
            {
                x: _options.x,
                y: _options.y
            };
        this.direction =
            {
                x: _options.direction.x,
                y: _options.direction.y
            };
        this.body = [];
        this.isAlive = true;
        this.ate = false;
        this.scale = _options.scale;
        this.grow();
        this.grow();
        this.grow();
    }
    updatePosition() {
        // keep trace of previous head position (for collision management)
        this.head.previousX = this.head.x;
        this.head.previousY = this.head.y;
        // update head position relative to direction
        this.head.x += this.direction.x;
        this.head.y += this.direction.y;
        this.body.push({ x: this.head.x, y: this.head.y }); // add a block ahead of the snake
        this.body.shift(); // remove the last block of its tail
    }
    outerRingCollision(_canvas) {
        if (this.head.x <= 0) {
            this.head.x = 0;
            this.direction.x = 0;
        }
        else if (this.head.x >= 11) {
            this.head.x = 11;
            this.direction.x = 0;
        }
        if (this.head.y <= 0) {
            this.head.y = 0;
            this.direction.y = 0;
        }
        else if (this.head.y >= 19) {
            this.head.y = 19;
            this.direction.y = 0;
        }
    }
    fatalCollisionDetection(_canvas) {
        /* outer ring */
        if (this.head.x < 0
            || this.head.x > (_canvas.width - this.scale) / this.scale
            || this.head.y < 0
            || this.head.y > (_canvas.height - this.scale) / this.scale)
            this.isAlive = false;
        /* self collision detection */
        if (this.body.length <= 4)
            return; // no need to test self-collision if snake length < 4
        const max = this.body.length - 4;
        const verifyArray = this.body.slice(0, max);
        for (const _bodyPart of verifyArray) {
            if (this.head.x == _bodyPart.x && this.head.y == _bodyPart.y) {
                this.isAlive = false;
            }
        }
    }
    appleCollisionDetection(list) {
        this.apples = list;
        for (const _apple of this.apples) {
            if (this.head.x == _apple.position.x && this.head.y == _apple.position.y) {
                this.ate = true;
                _apple.isEaten = true;
            }
        }
        return this.apples;
    }
    draw() {
        /* draw the snake */
        this.context.fillStyle = this.color;
        this.context.beginPath();
        for (const _bodyPart of this.body) {
            const x = _bodyPart.x * this.scale;
            const y = _bodyPart.y * this.scale;
            const width = 1 * this.scale;
            const height = 1 * this.scale;
            this.context.fillRect(x, y, width, height);
        }
        /* color the head when the snake dies */
        if (!this.isAlive) {
            this.context.fillStyle = 'red';
            const x = this.head.x * this.scale;
            const y = this.head.y * this.scale;
            const width = 1 * this.scale;
            const height = 1 * this.scale;
            this.context.fillRect(x, y, width, height);
        }
        const centerOf = (_cell, _scale) => {
            return _cell * _scale + _scale / 2;
        };
        // highlight the head
        // create gradient
        this.context.beginPath();
        const gradient = context.createRadialGradient(centerOf(this.head.x, this.scale), // inner x
        centerOf(this.head.y, this.scale), // inner y
        0, // inner radius
        centerOf(this.head.x, this.scale), // outer x
        centerOf(this.head.y, this.scale), // outer y
        2 * this.scale // outer radius
        );
        if (this.isAlive) {
            gradient.addColorStop(0, '#32CE3699');
            gradient.addColorStop(1, '#32CE3600');
        }
        else {
            gradient.addColorStop(0, '#CE323699');
            gradient.addColorStop(1, '#CE323600');
        }
        /* draw the gradient */
        this.context.fillStyle = gradient;
        this.context.arc(centerOf(this.head.x, this.scale), // x
        centerOf(this.head.y, this.scale), // y 
        10 * this.scale, // radius
        0, // start angle
        Math.PI * 2 // theta
        );
        this.context.fill();
    }
    setDirectionTo(input) {
        switch (input) {
            case 0:
                this.direction.x = 0;
                this.direction.y = -1;
                break;
            case 1:
                this.direction.x = 1;
                this.direction.y = 0;
                break;
            case 2:
                this.direction.x = 0;
                this.direction.y = 1;
                break;
            case 3:
                this.direction.x = -1;
                this.direction.y = 0;
                break;
            default:
                break;
        }
    }
    grow() {
        this.body.push({ x: this.head.x, y: this.head.y });
    }
}
const $button = document.querySelector('.js-invite');
const url = new URL(window.location.href);
const path = url.pathname.substring(1);
// const multiCountdown = () =>
// {
//     let sec = 3
//     const countdown = setInterval(() => 
//     {
//         console.log(sec)
//         sec--
//         if (sec == 0) 
//         {
//             window.clearInterval(countdown)
//         }
//     }, 1000)
// }
// let multiRunning = false
const connect = () => {
    const socket = io();
    // controls
    const keyboardInput = (_event) => {
        let input = 5;
        switch (_event.key) {
            case 'ArrowUp':
            case 'z':
                // if (snake.head.x == snake.head.previousX) return
                input = 0;
                break;
            case 'ArrowRight':
            case 'd':
                // if (snake.head.y == snake.head.previousY) return
                input = 1;
                break;
            case 'ArrowDown':
            case 's':
                // if (snake.head.x == snake.head.previousX) return
                input = 2;
                break;
            case 'ArrowLeft':
            case 'q':
                // if (snake.head.y == snake.head.previousY) return
                input = 3;
                break;
            case 'g':
                snake.grow();
                break;
        }
        if (input < 5) {
            socket.emit('input', input);
            snake.setDirectionTo(input);
        }
    };
    document.addEventListener('keydown', keyboardInput);
    // if (!path)   // 1st player
    // {
    //     console.log('give this link to your friend')
    // }
    socket.on('chat message', (msg) => {
        console.log(msg);
    });
    // socket.on('snakeParam', (param) => // assign snake initial position
    // {
    //     snake.head.x = param.posX
    //     snake.head.x = param.posY
    //     snake.direction.x = param.dirX
    //     snake.direction.x = param.dirY
    //     snakes.push(snake)
    // })
    // socket.on('enemyParam', (param) => // assign snake initial position
    // {
    //     const enemy = new Snake(
    //         {
    //             context: context,
    //             x: 3,
    //             y: 10,
    //             direction: 
    //             {
    //                 x: 1,
    //                 y: 0
    //             },
    //             color: '#5C25C2',
    //             apples: apples,
    //             scale: frame.scale
    //         })
    //     enemy.head.x = param.posX
    //     enemy.head.x = param.posY
    //     enemy.direction.x = param.dirX
    //     enemy.direction.x = param.dirY
    //     snakes.push(enemy)
    // })
    // let silentDisconnexion = false
    // socket.on('errorMsg', (msg: string) => 
    // {
    //     switch (msg) 
    //     {
    //         case '1':
    //             console.log('Sorry, but the party you\'re trying to join is either full or empty. Make sure you wrote the address right, or please ask your friend to try again.')
    //             break;
    //         default:
    //         console.log(msg)
    //             break;
    //     }
    //     silentDisconnexion = true
    // })
    // socket.on('disconnect', () =>
    // {
    //     if (!silentDisconnexion) console.log('oops, you were disconnected. Please verify the quality of your connection')
    // })
    // socket.on('gameStatus', (status) => 
    // {
    //     switch (status) 
    //     {
    //         case 'start':
    //             // multiRunning = true
    //             // multiCountdown()
    //             document.addEventListener('keydown', multiControls)
    //             break
    //         case 'stop':
    //             break
    //         default:
    //             break
    //     }
    // })
    const useEnemyInput = (direction) => {
        console.log('enemyDirection:', direction);
        snakes[1].setDirectionTo(direction);
    };
    socket.on('enemyInput', useEnemyInput);
};
connect();
// $button.addEventListener('click', () =>
// {
//     connect()
// })
// if (path)
// {
//     connect()
// }
/// <reference path="Snake.ts" />
/// <reference path="Apple.ts" />
/// <reference path="client.ts" />
/* Set up */
const $wrapper = document.querySelector('.wrapper');
const $canvas = document.querySelector('.js-canvas');
const context = $canvas.getContext('2d');
$canvas.focus();
/* Resize */
const frame = {
    width: $canvas.width,
    height: $canvas.height,
    scale: 20
};
let apples = [];
const apple = new Apple({
    context: context,
    color: 'white',
    x: 2,
    y: 2,
    canvasSizes: frame
});
apples.push(apple);
let snakes = [];
const snake = new Snake({
    context: context,
    x: 5,
    y: 3,
    direction: {
        x: 0,
        y: 1
    },
    color: '#32CE36',
    apples: apples,
    scale: frame.scale
});
snakes.push(snake);
const enemy = new Snake({
    context: context,
    x: 5,
    y: 3,
    direction: {
        x: 0,
        y: 1
    },
    color: '#5C25C2',
    apples: apples,
    scale: frame.scale
});
snakes.push(enemy);
let localGame = true;
// controls
// const controls = (_event: KeyboardEvent) =>
// {
//     console.log(_event)
//     switch (_event.key)
//     {
//         case 'ArrowUp':
//         case 'z':
//             // if (snake.direction.y == 1) return // prevent the player from going straight back in the opposite direction
//             // if (snake.head.x == snake.body[length-1].x && snake.head.y == snake.body[length-1].y + 1) return // works, but ugly
//             if (snake.head.x == snake.head.previousX) return
//             snake.setDirectionTo(0, -1)
//             break
//         case 'ArrowRight':
//         case 'd':
//             // if (snake.direction.x == -1) return
//             if (snake.head.y == snake.head.previousY) return
//             snake.setDirectionTo(1, 0)
//             break
//         case 'ArrowDown':
//         case 's':
//             // if (snake.direction.y == -1) return
//             if (snake.head.x == snake.head.previousX) return
//             snake.setDirectionTo(0, 1)
//             break
//         case 'ArrowLeft':
//         case 'q':
//             // if (snake.direction.x == 1) return
//             if (snake.head.y == snake.head.previousY) return
//             snake.setDirectionTo(-1, 0)
//             break
//         case 'g':
//             snake.grow()
//             break
//     }
// }
// document.addEventListener('keydown', controls)
const drawGrid = (_canvas, _color) => {
    context.strokeStyle = _color;
    context.beginPath();
    for (var x = 0; x <= _canvas.width; x += _canvas.scale) {
        context.moveTo(x, 0);
        context.lineTo(x, _canvas.height);
    }
    for (var y = 0; y <= _canvas.height; y += _canvas.scale) {
        context.moveTo(0, y);
        context.lineTo(_canvas.height, y);
    }
    context.stroke();
};
const drawCheckeredBackground = (_canvas, _color) => {
    context.fillStyle = _color;
    let w = _canvas.width;
    let h = _canvas.height;
    const nCol = w / _canvas.scale;
    const nRow = h / _canvas.scale;
    w /= nCol; // width of a block
    h /= nRow; // height of a block
    context.beginPath();
    for (let i = 0; i < nRow; ++i) {
        for (let j = 0, col = nCol / 2; j < col; ++j) {
            context.rect(2 * j * w + (i % 2 ? 0 : w), i * h, w, h);
        }
    }
    context.fill();
};
const fps = 12;
const loop = () => {
    setTimeout(() => {
        const game = window.requestAnimationFrame(loop);
        /**
         * Update Phase
         */
        for (const _snake of snakes) {
            // update snakes positions
            _snake.updatePosition();
            _snake.outerRingCollision(frame);
            // // resolve snakes collisions
            // _snake.fatalCollisionDetection(frame)
            // if (!_snake.isAlive) 
            // {
            //     window.cancelAnimationFrame(game)
            //     document.removeEventListener('keydown', controls)
            //     console.log('you died. max length:', _snake.body.length)
            // }
            // // resolve snake-apple collisions
            // apples = _snake.appleCollisionDetection(apples)
            // if (_snake.ate)
            // {
            //     _snake.ate = false
            //     _snake.grow()
            // }
        }
        /**
         * Drawing phase
         */
        /* Clear canvas */
        context.clearRect(0, 0, frame.width, frame.height);
        /* Draw */
        for (const _snake of snakes) {
            _snake.draw();
        }
        drawCheckeredBackground(frame, '#FFFFFF22');
    }, 1000 / fps);
};
loop();
// const loop = () =>
// {
//     setTimeout(() => 
//     {
//         const game = window.requestAnimationFrame(loop)
//         // Maths
//         for (const _snake of snakes)
//         {
//             // update snakes positions
//             _snake.updatePosition()
//             // resolve snakes collisions
//             _snake.fatalCollisionDetection(frame)
//             if (!_snake.isAlive) 
//             {
//                 window.cancelAnimationFrame(game)
//                 document.removeEventListener('keydown', controls)
//                 console.log('you died. max length:', _snake.body.length)
//             }
//             // resolve snake-apple collisions
//             apples = _snake.appleCollisionDetection(apples)
//             if (_snake.ate)
//             {
//                 _snake.ate = false
//                 _snake.grow()
//             }
//             // Clear canvas
//             context.clearRect(0, 0, frame.width, frame.height)
//             // Draw
//             _snake.draw()
//         }
//         for (const _apple of apples)
//         {
//             if (_apple.isEaten)
//             {
//                 _apple.relocate()
//             }
//             _apple.draw()
//         }
//         /* style the map */
//         // drawGrid(frame, 'black')
//         drawCheckeredBackground(frame, '#FFFFFF22')
//     }, 1000/fps)
// }
// loop()
// const $restart: Element = document.querySelector('.js-restart')
// $restart.addEventListener('click', () =>
// {
//     document.removeEventListener('keydown', controls)
//     snakes.forEach(_snake => 
//     {
//         snake.isAlive = true
//         snake.body = []
//         snake.grow()
//         snake.grow()
//         snake.grow()
//         snake.head.x = 9
//         snake.head.y = 3
//         snake.direction.x = 0
//         snake.direction.y = 1
//     })
//     // console.log(snakes)
//     $canvas.focus()
//     // snakes.splice(0, 1)
//     // console.log(snakes)
//     // const snake = new Snake(
//     // {
//     //     context: context,
//     //     x: 9,
//     //     y: 3,
//     //     direction: 
//     //     {
//     //         x: 0,
//     //         y: 1
//     //     },
//     //     color: '#32CE36',
//     //     apples: apples,
//     //     scale: frame.scale
//     // })
//     // snakes.push(snake)
//     // console.log(snakes)
//     document.addEventListener('keydown', controls)
//     loop()
// })
