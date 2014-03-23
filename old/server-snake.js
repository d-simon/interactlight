var DMX = require('dmx')
  , dmx = new DMX()
  , A = DMX.Animation;

dmx.addUniverse(0, 'enttec-usb-dmx-pro', 0);

var clear = require('clear');

var screenWidth = process.argv[2] || 12;
var screenHeight = process.argv[3] || 12;

// var screenGrid = [
//                     [55,56,57,58,59,60,61],
//                     [44,43,42,41,40,39,38],
//                     [25,24,23,22,21,20,19],
//                     [31,32,33,34,35,36,37],
//                     [12,13,14,15,16,17,18],
//                     [ 6, 5, 4, 3, 2, 1, 0]
//                 ];

var colors = require('colors');

var keypress = require('keypress')
  , Snake = require('./lib/snake')
  , snake = new Snake(screenWidth, screenHeight, process.argv[4] || 220);

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

    //console.log('got "keypress"', key.name);
    if (key && key.ctrl && key.name == 'c') {
        process.exit(0);
    }
});

// Display Game State
snake.stream.on('update', function (state) {
    var obj = {};

    // Draw Screen
    for (var i = 0; i < screenHeight; i++) {
        for (var j = 0; j < screenWidth; j++) {
            obj[(i*screenWidth+j)*3] = 0;
            obj[(i*screenWidth+j)*3+1] = 0;
            obj[(i*screenWidth+j)*3+2] = 0;
        }
    }
    for (var i = 0; i < state.body.length; i++) {
        obj[(state.body[i].y*screenWidth+state.body[i].x)*3] = 10;
        obj[(state.body[i].y*screenWidth+state.body[i].x)*3+1] = 10;
        obj[(state.body[i].y*screenWidth+state.body[i].x)*3+2] = 10;
    }

    obj[(state.food.y*screenWidth+state.food.x)*3] = 10;
    obj[(state.food.y*screenWidth+state.food.x)*3+1] = 50;
    obj[(state.food.y*screenWidth+state.food.x)*3+2] = 10;

    dmx.update(0, obj);

    // draw console
    clear();
    var printScreen = [];
    for (var i = 0; i < snake.height; i++) {
        printScreen.push([]);
        for (var j = 0; j < snake.width; j++) {
            printScreen[i].push('  '.inverse);
        }
    }
    for (var i = 0; i < state.body.length; i++) {
        printScreen[state.body[i].y][state.body[i].x] = '  '.white.inverse;
    }
    printScreen[state.food.y][state.food.x] = '  '.green.inverse;

    for (var i = 0; i < printScreen.length; i++) {
        console.log(printScreen[i].join(''.inverse));
    }
    console.log('Score: ', state.score);
    if (state.gameOver) {
        console.log('GAME OVER!'.red.inverse);
        console.log('Press Space to restart');
    }

});
process.stdin.setRawMode(true);
process.stdin.resume();