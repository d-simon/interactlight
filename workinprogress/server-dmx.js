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

var WorkerPool = require('./lib/workerpool');
var workerPool = new WorkerPool(38); // 2 * 19 LEDs

var inToDuration = 100
  , outToDuration = 100;

twit.stream('statuses/sample', {filter_level:'none'}, function(stream) {
    stream.on('data', function(data) {
        if (data) console.log('sample', data.text.replace(/(\r\n|\n|\r)/gm,""));
        workerPool.go(function (done, workerIndex) {
            var inTo = {};
                inTo[(workerIndex)*3] = 0;
                inTo[(workerIndex)*3+1] = 10;
                inTo[(workerIndex)*3+2] = 0;
            var outTo = {};
                outTo[(workerIndex)*3] = 0;
                outTo[(workerIndex)*3+1] = 0;
                outTo[(workerIndex)*3+2] = 0;
            var animation = new A();
            animation
                .add(inTo, inToDuration, { })
                .add(outTo, outToDuration, {})
                .run(dmx.universes[0], function () { done(workerIndex); });
        });
    });
});

// twit.stream('statuses/filter', {filter_level:'none', track: ['ukraine' , 'obama ukraine', 'krim obama', 'obama']}, function(stream) {
//     stream.on('data', function(data) {
//         if (data) console.log('ukraine', data.text.replace(/(\r\n|\n|\r)/gm,""));
//         workerPool.go(function (done, workerIndex) {
//             var inTo = {};
//                 inTo[(workerIndex)*3] = 0;
//                 inTo[(workerIndex)*3+1] = 50;
//                 inTo[(workerIndex)*3+2] = 0;
//             var outTo = {};
//                 outTo[(workerIndex)*3] = 0;
//                 outTo[(workerIndex)*3+1] = 0;
//                 outTo[(workerIndex)*3+2] = 0;
//             var animation = new A();
//             animation
//                 .add(inTo, inToDuration, { })
//                 .add(outTo, outToDuration, {})
//                 .run(dmx.universes[0], function () { done(workerIndex); });
//         });
//     });
// });

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
//                 .add(inTo, inToDuration, { })
//                 .add(outTo, outToDuration, { })
//                 .run(dmx.universes[0], function () { done(workerIndex); });
//         });
//     });
// });

