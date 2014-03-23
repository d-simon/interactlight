var Stream = require('stream');

function Pong (screenWidth, screenHeight, delay) {
    this.stream = new Stream();
    this.width = screenWidth || 10;
    this.height = screenHeight || 10;
    this.delay = delay || 330;
    this.state = this.generateDefaultState();
    var that = this;
    this.tick = 1;
    this.interval = setInterval(function () {
        if (that.state.gameRunning && !that.state.gameOver) {
            that.tick++;
            if (that.tick > 10) { that.tick = 1; that.update(); }
        }
        that.stream.emit('update', that.state);
    }, ~~(delay/10));
}

Pong.prototype.Player = function (position, AI, width, height) {
    this.position = position || Pong.prototype.PlayerPositions.LEFT;
    this.AI = !!AI;
    this.plattform = [];
    console.log(this.position*(width-1), height-1, width, height, this.position);
    for (var i = 0; i < 3; i++) {
        this.plattform.push(new Pong.prototype.Point(this.position*(width-1),height-1));
    }
};
Pong.prototype.PlayerPositions = {
    LEFT: 0,
    RIGHT: 1
};

Pong.prototype.Point = function (x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.collideWith = function (x, y) {
        return this.x === x && this.y === y;
    };
};

Pong.prototype.Ball = function (width, height) {
    var args = [~~(width/2), ~~(height/2)];
    Pong.prototype.Point.apply(this, args);
    this.direction = this.getRandomDirection();
    console.log(this);
};
Pong.prototype.Ball.prototype.Directions = {
    dir: {
        LEFTUP:       [-1,1],
        LEFT:         [-1,0],
        LEFTDOWN:     [-1,-1],
        RIGHTUP:      [1,1],
        RIGHT:        [1,0],
        RIGHTDOWN:    [0,1],
    },
    count: 6
};
Pong.prototype.Ball.prototype.move = function () {
    this.x += this.direction[0];
    this.y += this.direction[1];
};
Pong.prototype.Ball.prototype.step = function () {
    if (this.x === 0) {

    }
};
Pong.prototype.Ball.prototype.getRandomDirection = function () {
    var count = ~~(0.5 + Math.random() * this.Directions.count),
        current = 0;
    for (var direction in this.Directions.dir) {
        if (current === count) {
            return this.Directions.dir[direction];
        }
        current++;
    }
    return [0,0];
};

Pong.prototype.generateDefaultState = function () {
    return {
        gameWin: false,
        gameRunning: true,
        gameOver: false,
        score: [0,0],
        players: [
            new this.Player(this.PlayerPositions.LEFT, false, this.width, this.height),
            new this.Player(this.PlayerPositions.RIGHT, true, this.width, this.height)
        ],
        ball: new this.Ball(this.width, this.height)
    };
};

Pong.prototype.start = function () {
    this.state = this.generateDefaultState();
};
Pong.prototype.update = function () {
    this.state = this.generateDefaultState();
};
Pong.prototype.cmd = function (cmd) {
    switch(cmd) {
        case 'up':
            // this.state.players[0]
            break;
        case 'down':
            if (this.state.direction !== this.SnakeDirections.UP) {
                this.state.direction = this.SnakeDirections.DOWN;
            }
            break;
        case 'restart':
            this.state = null;
            this.state = this.generateDefaultState();
            break;
        case 'pause':
            this.state.gameRunning = !!!this.state.gameRunning;
            break;
        default:
            break;
    }
};

module.exports = Pong;