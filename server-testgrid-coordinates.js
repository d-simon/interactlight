var config = require('./config.js');
var twitter = require('ntwitter');
var twit = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});

var DMX = require('dmx')
  , dmx = new DMX()
  , dmx2 = new DMX()
  , A = DMX.Animation;

dmx.addUniverse(0, 'enttec-usb-dmx-pro', 0);
dmx2.addUniverse(0, 'enttec-usb-dmx-pro', 1);

var VirtualScreen = require('./lib/virtualscreen')
  , screenWidth = 24
  , screenHeight = 12
    virtualScreen = new VirtualScreen(screenWidth,screenHeight,1);

// var screenGrid = [
//                     [55,56,57,58,59,60,61],
//                     [44,43,42,41,40,39,38],
//                     [25,24,23,22,21,20,19],
//                     [31,32,33,34,35,36,37],
//                     [12,13,14,15,16,17,18],
//                     [ 6, 5, 4, 3, 2, 1, 0]
//                 ];

function reduceUntilZero (inputVal, n) {
    var n = n || 1;
    return (inputVal > n) ? inputVal - n : 0;
}
function reduceUntil (inputVal, min, n) {
    var min = min || 50;
    var n = n || 1;
    return (inputVal > min) ? inputVal - n : min;
}

var reduceInterval =  setInterval(function () {
    var obj = {};
    var obj2 = {};
    for (var i = 0; i < screenHeight; i++) {
        for (var j = 0; j < screenWidth/2; j++) {
            obj[(i*screenWidth/2+j)*3+0] = (dmx.universes[0].get((i*screenWidth/2+j)*3+0) > 0) ? reduceUntil(dmx.universes[0].get((i*screenWidth/2+j)*3+0),1) : reduceUntilZero(dmx.universes[0].get((i*screenWidth/2+j)*3+0),5);
            obj[(i*screenWidth/2+j)*3+1] = (dmx.universes[0].get((i*screenWidth/2+j)*3+1) > 0) ? reduceUntil(dmx.universes[0].get((i*screenWidth/2+j)*3+1),1) : reduceUntilZero(dmx.universes[0].get((i*screenWidth/2+j)*3+1),5);
            obj[(i*screenWidth/2+j)*3+2] = (dmx.universes[0].get((i*screenWidth/2+j)*3+2) > 0) ? reduceUntil(dmx.universes[0].get((i*screenWidth/2+j)*3+2),1) : reduceUntilZero(dmx.universes[0].get((i*screenWidth/2+j)*3+2),5);
        }
    }
    for (var i = 0; i < screenHeight; i++) {
        for (var j = 0; j < screenWidth/2; j++) {
            obj2[(i*screenWidth/2+j)*3+0] = (dmx2.universes[0].get((i*screenWidth/2+j)*3+0) > 0) ? reduceUntil(dmx2.universes[0].get((i*screenWidth/2+j)*3+0),1) : reduceUntilZero(dmx2.universes[0].get((i*screenWidth/2+j)*3+0),5);
            obj2[(i*screenWidth/2+j)*3+1] = (dmx2.universes[0].get((i*screenWidth/2+j)*3+1) > 0) ? reduceUntil(dmx2.universes[0].get((i*screenWidth/2+j)*3+1),1) : reduceUntilZero(dmx2.universes[0].get((i*screenWidth/2+j)*3+1),5);
            obj2[(i*screenWidth/2+j)*3+2] = (dmx2.universes[0].get((i*screenWidth/2+j)*3+2) > 0) ? reduceUntil(dmx2.universes[0].get((i*screenWidth/2+j)*3+2),1) : reduceUntilZero(dmx2.universes[0].get((i*screenWidth/2+j)*3+2),5);
        }
    }
    dmx.update(0, obj);
    dmx2.update(0, obj2);
    virtualScreen.updateDMX(0, obj);
}, 33);


twit.stream('statuses/filter', {filter_level:'none', locations:'-180,-90,180,90'}, function(stream) {
    stream.on('data', function(data) {
        //if (data) console.log(data.user.name, data.text.replace(/(\r\n|\n|\r)/gm,""));
        // var obj = {};

        // for (var i = 0; i < screenGrid.length; i++) {
        //     for (var j = 0; j < screenGrid[i].length; j++) {
        //         obj[screenGrid[i][j]*3] = 255;
        //         obj[screenGrid[i][j]*3+1] = 255;
        //         obj[screenGrid[i][j]*3+2] = 255;
        //     }
        // }

        // for (var i = 0; i < screenGrid.length; i++) {
        //     for (var j = 0; j < screenGrid[i].length; j++) {
        //         obj[screenGrid[i][j]*3] = 255;
        //         obj[screenGrid[i][j]*3+1] = 255;
        //         obj[screenGrid[i][j]*3+2] = 255;
        //     }
        // }

        var array = [],
            obj = {},
            obj2 = {};

        if (data.geo) {
            array.push({
                x: ~~((data.geo.coordinates[1] + 180) / 360 * screenWidth),
                y: screenHeight - ~~((data.geo.coordinates[0] + 90) / 180 * screenHeight),
                r: 10,
                g: 10,
                b: 255
            });
            //console.log(array[0].y, array[0].x);
            if (array[0].x < 12) {
                var led = array[0].y*screenWidth/2+array[0].x;
                obj[led*3+0] = Math.min(dmx.universes[0].get(led*3+0) + 5, 50);
                obj[led*3+1] = Math.min(dmx.universes[0].get(led*3+1) + 5, 50);
                obj[led*3+2] = Math.min(dmx.universes[0].get(led*3+2) + 5, 50);

            } else {
                var led = array[0].y*screenWidth/2+array[0].x-12;
                obj2[led*3+0] = Math.min(dmx2.universes[0].get(led*3+0) + 5, 50);
                obj2[led*3+1] = Math.min(dmx2.universes[0].get(led*3+1) + 5, 50);
                obj2[led*3+2] = Math.min(dmx2.universes[0].get(led*3+2) + 5, 50);
            }
        }
        virtualScreen.updateObj(array);
        dmx.update(0, obj);
        dmx2.update(0, obj2);


    });
    stream.on('error', function (method, code) {
        console.log(arguments);
    })
});

setInterval(function (argument) {
    virtualScreen.paint();
}, 1330);


// twit.stream('statuses/filter', {filter_level:'none', track: ['russia', 'putin ukraine', 'krim putin', 'putin']}, function(stream) {
//     stream.on('data', function(data) {
//         if (data) console.log('russia ', data.text.replace(/(\r\n|\n|\r)/gm,""));
//         workerPool.go(function (done, workerIndex) {
//             var inTo = {};
//                 inTo[workerIndex*3] = 50;
//                 inTo[workerIndex*3+1] = 0;
//                 inTo[workerIndex*3+2] = 0;
//             var outTo = {};
//                 outTo[workerIndex*3] = 0;
//                 outTo[workerIndex*3+1] = 0;
//                 outTo[workerIndex*3+2] = 0;
//             var animation = new A();
//             animation
//                 .add(inTo, 100, { })
//                 .add(outTo, 200, { })
//                 .run(dmx.universes[0], function () { done(workerIndex); });
//         });
//     });
// });

