var twitter = require('ntwitter');
var twit = new twitter({
    consumer_key: 'hJX4AUlpQQPLzxSlJrupBQ',
    consumer_secret: 'H2KEcT40VKSDcj7kfbGIxEdOBsgbG798bwSAl8ClEmQ',
    access_token_key: '327060292-mGH02XJ4vu6kslc7FYxBtz6sxyXnKr9ypMj9RGqM',
    access_token_secret: '5jn9fdIlYGwVXIeNtnZDuB0OkW6id73gPR516DYfyP7R4'
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

