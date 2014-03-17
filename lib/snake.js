var Stream = require('stream')

function Snake (screenWidth, screenHeight, delay) {
    this.stream = new Stream();
    this.width = screenWidth || 10;
    this.height = screenHeight || 10;
    this.delay = delay || 330;
    this.state = this.generateDefaultState();

    var that = this;
    this.interval = setInterval(function () {
        if (that.state.gameRunning && !that.state.gameOver) {
            that.update();
        }
        that.stream.emit('update', that.state);
    }, delay);
};

Snake.prototype.Point = function (x, y) {
    this.x = x;
    this.y = y;

    this.collideWith = function (x, y) {
        return this.x === x && this.y === y;
    }
};

Snake.prototype.getRandomRange = function (min, max) {
    return Math.random() * (max - min + 1) + min;
};
Snake.prototype.getRandomDirection = function () {
    return ~~this.getRandomRange(0.5,4.5);
};
Snake.prototype.getRandomPoint = function () {
    return new this.Point(~~this.getRandomRange(0,this.width-1),~~this.getRandomRange(0,this.height-1));
};
Snake.prototype.getRandomFreePoint = function () {
    // Create Index - remove occupied, choose one at random
    var grid = [];
    yloop: // rows
    for (var i = 0; i < this.height; i++) {
        xloop: // columns
        for (var j = 0; j < this.width; j++) {
            checkloop: // check if field is empty
            for (var k = 0; k < this.state.body.length; k++) {
                if (j === this.state.body[k].x && i === this.state.body[k].y) {
                    continue xloop; // omit this field
                }
            }
            grid.push(new this.Point(j,i));
        }
    }
    var random = ~~(Math.random(0)*grid.length);
    return (grid.length) ? grid[random] : false;

};

Snake.prototype.width = 0;
Snake.prototype.height = 0;
Snake.prototype.SnakeDirections = {
    UP : 0,
    DOWN : 1,
    LEFT : 2,
    RIGHT : 3
};

Snake.prototype.generateDefaultState = function () {
    return {
        gameWin: false,
        gameRunning: true,
        gameOver: false,
        score: 0,
        direction: this.SnakeDirections.UP,
        body: [
            new this.Point(~~(this.getRandomRange(1, this.width-1)),
                      ~~(this.getRandomRange((this.height-1)/2, this.height-1)))
        ],
        food: new this.Point(~~(this.getRandomRange(1, this.width-1)),
                      ~~(this.getRandomRange(1, this.height-1)))
    };
};

Snake.prototype.start = function () {
    this.state = this.generateDefaultState();
};

Snake.prototype.update = function () {
    var s = this.state,
        step = 1;
    switch (s.direction) {
        case this.SnakeDirections.LEFT:
            if (s.body[0].x > 0) {
                s.body.unshift(new this.Point(s.body[0].x - step, s.body[0].y));
                s.body.pop();
            } else {
                s.body[0].x = 0;
                s.gameOver = true;
            }
            break;

        case this.SnakeDirections.UP:
            if (s.body[0].y > 0) {
                s.body.unshift(new this.Point(s.body[0].x, s.body[0].y - step));
                s.body.pop();
            } else {
                s.body[0].y = 0;
                s.gameOver = true;
            }
            break;

        case this.SnakeDirections.RIGHT:
            if (s.body[0].x < this.width - 1) {
                s.body.unshift(new this.Point(s.body[0].x + step, s.body[0].y));
                s.body.pop();
            } else {
                s.body[0].x = this.width-1;
                s.gameOver = true;
            }
            break;

        case this.SnakeDirections.DOWN:
            if (s.body[0].y < this.height - 1) {
                s.body.unshift(new this.Point(s.body[0].x, s.body[0].y + step));
                s.body.pop();
            } else {
                s.body[0].y = this.height-1;
                s.gameOver = true;
            }
            break;
    }

    // check for yourself
    if (s.body.length > 1) {
        for (var i = 1; i < s.body.length; i++) {
            if (s.body[0].collideWith(s.body[i].x, s.body[i].y)) {
                s.gameOver = true;
            }
        }
    }

    // check for food
    if (s.body[0].collideWith(s.food.x, s.food.y)) {
        s.body.push(new this.Point(s.body[s.body.length-1].x, s.body[s.body.length-1].y));
        s.food = this.getRandomFreePoint();
        s.score += 10;
        if (s.score > 250) {
            s.gameWin = true;
        }
    }
};

Snake.prototype.cmd = function (cmd) {
    switch(cmd) {
        case 'up':
            if (this.state.direction !== this.SnakeDirections.DOWN) {
                this.state.direction = this.SnakeDirections.UP;
            }
            break;
        case 'down':
            if (this.state.direction !== this.SnakeDirections.UP) {
                this.state.direction = this.SnakeDirections.DOWN
            };
            break;
        case 'left':
            if (this.state.direction !== this.SnakeDirections.RIGHT) {
                this.state.direction = this.SnakeDirections.LEFT;
            }
            break;
        case 'right':
            if (this.state.direction !== this.SnakeDirections.LEFT) {
                this.state.direction = this.SnakeDirections.RIGHT;
            }
            break;
        case 'restart':
            this.state = null;
            this.state = this.generateDefaultState();
            break;
        case 'pause':
            this.state.gameRunning = !!!this.state.gameRunning;
        default:
            break;
    }
};


module.exports = Snake;