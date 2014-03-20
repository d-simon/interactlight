var pixelScreen = require('./screen-36x24.js')

var screenWidth = pixelScreen.width / 2;
var screenHeight = pixelScreen.height / 2;

var keypress = require('keypress')
  , Snake = require('./lib/snake')
  , snake = new Snake(screenWidth, screenHeight, 220);

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {

    switch(key.name) {
        case 'up':
            snake.cmd('up')
            break;
        case 'down':
            snake.cmd('down')
            break;
        case 'left':
            snake.cmd('left')
            break;
        case 'right':
            snake.cmd('right')
            break;
        case 'space':
            snake.cmd('restart')
            break;
        case 'p':
            snake.cmd('pause')
            break;
        default:
            break;
    }

    if (key && key.ctrl && key.name == 'c') {
        process.exit(0);
    }
});

// Display Game State
snake.stream.on('update', function (state) {

    // Create Empty Screen
    var array = [];
    for (var i = 0; i < pixelScreen.height; i++) {
        array.push([]);
        for (var j = 0; j < pixelScreen.width; j++) {
            array[i].push([]);
            for (var k = 0; k < pixelScreen.channels; k++) {
                array[i][j].push(0);
            };
        };
    }

    // Draw Body
    for (var i = 0; i < state.body.length; i++) {
        array[state.body[i].y*2][state.body[i].x*2] = [10,10,10];
        array[state.body[i].y*2][state.body[i].x*2+1] = [10,10,10];
        array[state.body[i].y*2+1][state.body[i].x*2] = [10,10,10];
        array[state.body[i].y*2+1][state.body[i].x*2+1] = [10,10,10];
    }

    // Draw Food
    array[state.food.y*2][state.food.x*2] = [10,50,10];
    array[state.food.y*2][state.food.x*2+1] = [10,50,10];
    array[state.food.y*2+1][state.food.x*2] = [10,50,10];
    array[state.food.y*2+1][state.food.x*2+1] = [10,50,10];

    // Update Screen
    pixelScreen.update(array);

});

process.stdin.setRawMode(true);
process.stdin.resume();