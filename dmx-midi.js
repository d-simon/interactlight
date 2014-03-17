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
var workerPool = new WorkerPool(50); // 2 * 19 LEDs
var workerPool2 = new WorkerPool(19); // 2 * 19 LEDs

var midi = require('midi');

// Set up a new output.
var output = new midi.output();

// Count the available output ports.
console.log(output.getPortCount(), output.getPortName(1));

output.openPort(0);


function generateMidiTable () {
    var returnA = [];
    for (var i = 0; i < 12; i++) {
        var array = [];
        for (var j = 0; j < 11; j++) {
            array.push(i + j*12);
        };
        returnA.push(array);
    }
    return returnA;
}

//   c+1 c+3 c+6 c+8 c+10
var midiTable = generateMidiTable()
  , key = [0,2,4,5,7,9,11]; // C dur


//var throttle = 0;
//twit.stream('statuses/filter', {filter_level:'none', track: ['obama']}, function(stream) {
twit.stream('statuses/sample', {filter_level:'none'}, function(stream) {
    stream.on('data', function(data) {
        if (data) console.log(data.user.name, data.text.replace(/(\r\n|\n|\r)/gm,""));
        // Send a MIDI message.
        // throttle++;
        // if (throttle > 0) {
        //     throttle = 0;
            workerPool.go(function (done, workerIndex) {


                var timezoneKey = ~~(data.user.utc_offset / 3600 + 12) // 0-23
                  , note = midiTable[key[timezoneKey % key.length]][~~(timezoneKey / key.length)];

                  console.log(36+note);

                output.sendMessage([144,36+note,100]);
                setTimeout(function () {
                    output.sendMessage([128,36+note,100]);
                },250);


                // output.sendMessage([144,25+workerIndex,100]);
                // setTimeout(function () {
                //     output.sendMessage([128,25+workerIndex,100]);
                // },250);

                console.log();
                var inTo = {};
                    inTo[workerIndex*3] = 50;
                    inTo[workerIndex*3+1] = 50;
                    inTo[workerIndex*3+2] = 50;
                var outTo = {};
                    outTo[workerIndex*3] = 0;
                    outTo[workerIndex*3+1] = 0;
                    outTo[workerIndex*3+2] = 0;
                var animation = new A();
                animation
                    .add(inTo, 50, { })
                    .add(outTo, 200, { })
                    .run(dmx.universes[0], function () { done(workerIndex); });

                done(workerIndex);
            });
        // }
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

