// var DMX = require('dmx')
//   , dmx = new DMX()
//   , A = DMX.Animation;

// dmx.addUniverse(0, 'enttec-usb-dmx-pro', 0);
var clear = require('clear');

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
  , Pong = require('./lib/pong')
  , pong = new Pong(process.argv[2] || 7, process.argv[3] || 6, 220);

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {

    switch(key.name) {
        case 'up':
            pong.cmd('up')
            break;
        case 'down':
            pong.cmd('down')
            break;
        case 'space':
            pong.cmd('restart')
            break;
        case 'p':
            pong.cmd('pause')
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
pong.stream.on('update', function (state) {
    var obj = {};

    // // Draw Screen
    // for (var i = 0; i < screenGrid.length; i++) {
    //     for (var j = 0; j < screenGrid[i].length; j++) {
    //         obj[screenGrid[i][j]*3] = 0;
    //         obj[screenGrid[i][j]*3+1] = 0;
    //         obj[screenGrid[i][j]*3+2] = 0;
    //     }
    // }
    // for (var i = 0; i < state.body.length; i++) {
    //     obj[screenGrid[state.body[i].y][state.body[i].x]*3] = 10;
    //     obj[screenGrid[state.body[i].y][state.body[i].x]*3+1] = 10;
    //     obj[screenGrid[state.body[i].y][state.body[i].x]*3+2] = 10;
    // }

    // obj[screenGrid[state.food.y][state.food.x]*3] = 10;
    // obj[screenGrid[state.food.y][state.food.x]*3+1] = 50;
    // obj[screenGrid[state.food.y][state.food.x]*3+2] = 10;

    //dmx.update(0, obj);

    // draw console
    clear();
    var printScreen = [];
    for (var i = 0; i < pong.height; i++) {
        printScreen.push([]);
        for (var j = 0; j < pong.width; j++) {
            printScreen[i].push('  '.inverse);
        }
    }
    for (var i = 0; i < state.players.length; i++) {
        for (var j = 0; j < state.players[i].plattform.length; j++) {
            printScreen[state.players[i].plattform[j].y][state.players[i].plattform[j].x] = '  '.white.inverse;

        }
    }
    console.log(state.ball);
    printScreen[state.ball.y][state.ball.x] = '  '.white.inverse;

    for (var i = 0; i < printScreen.length; i++) {
        console.log(printScreen[i].join(''.inverse));
    }
    console.log('Score: ', state.score[0], state.score[1]);
    if (state.gameOver) {
        console.log('GAME OVER!'.red.inverse);
        console.log('Press Space to restart');
    }

});
process.stdin.setRawMode(true);
process.stdin.resume();