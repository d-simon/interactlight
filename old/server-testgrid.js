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
  , A = DMX.Animation;

dmx.addUniverse(0, 'enttec-usb-dmx-pro', 0);

// var screenGrid = [
//                     [55,56,57,58,59,60,61],
//                     [44,43,42,41,40,39,38],
//                     [25,24,23,22,21,20,19],
//                     [31,32,33,34,35,36,37],
//                     [12,13,14,15,16,17,18],
//                     [ 6, 5, 4, 3, 2, 1, 0]
//                 ];
// var screenGrid = [
//     [35,34,33,32,31,30,29,28,27,26,25,24],
//     [23,22,21,20,19,18,17,16,15,14,13,12],
//     [11,10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
// ];


function reduceUntilZero (inputVal, n) {
    var n = n || 1;
    return (inputVal > n) ? inputVal - n : 0;
}

var reduceInterval =  setInterval(function () {
    var obj = {};
    for (var i = 0; i < screenGrid.length; i++) {
        for (var j = 0; j < screenGrid[i].length; j++) {
            obj[screenGrid[i][j]*3] = reduceUntilZero(dmx.universes[0].get(screenGrid[i][j]*3));
            obj[screenGrid[i][j]*3+1] = reduceUntilZero(dmx.universes[0].get(screenGrid[i][j]*3+1));
            obj[screenGrid[i][j]*3+2] = reduceUntilZero(dmx.universes[0].get(screenGrid[i][j]*3+2));
        }
    }
    dmx.update(0, obj);
}, 33);


twit.stream('statuses/filter', {filter_level:'none', locations:'-180,-90,180,90'}, function(stream) {
    stream.on('data', function(data) {
        if (data) console.log(data.user.name, data.text.replace(/(\r\n|\n|\r)/gm,""));
        var obj = {};


        for (var i = 0; i < screenGrid.length; i++) {
            for (var j = 0; j < screenGrid[i].length; j++) {
                obj[screenGrid[i][j]*3] = 5;
                obj[screenGrid[i][j]*3+1] = 5;
                obj[screenGrid[i][j]*3+2] = 5;
            }
        }


        dmx.update(0, obj);

    });
    stream.on('error', function (err, code) {
        console.log(err,code);
    });
});



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

