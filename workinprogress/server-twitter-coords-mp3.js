var pixelScreen = require('./screen-36x24.js')
  , fs = require('fs')
  , config = require('./config.js')
  , twitter = require('ntwitter')
  , twit = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});

var screenWidth = pixelScreen.width
  , screenHeight = pixelScreen.height;

var coordinates = [
    // -74,40,-73,41                          // New York (portrait)
    // -74,40.4,-72.5,41.2                    // New York (Manhatten landscape)
    // -0.510375,51.333117,0.334015,51.688469 // London
    // 31.12,13.75,62.21,32.34                // Saudi Arabia
    // -180,-60,180,80                       // World
     -180,-80,180,90                       // World
    //-13.64,35.81,42.22,58.67
];

function normalizeCoordinates (A, B, C) {

    // A = lowerLeft BoundingPoint
    // B = upperRight BoundingPoint
    // C = Point

    return [
            (C[0] - A[0]) / (B[0] - A[0]),
            (C[1] - B[1]) / (A[1] - B[1])
        ];
}

var words = [
    'cats',
    'cat',
    'dogs'
];

function hasKeyword (text) {
    for (var i = 0; i < words.length; i++) {
        if (text.toLowerCase().indexOf(words[i]) > -1) return true;
    }
    return false;
}


var Player = require('player');

// create player instance
var player = new Player('./app/birldsamples.mp3');

// play now and callback when playend


var soundCount = 0;
//twit.stream('statuses/sample', function (stream) {
twit.stream('statuses/filter', { filter_level:'none', locations:coordinates.join(',') }, function(stream) {
    stream.on('data', function(data) {
        if (data) console.log(data.user.name, data.text.replace(/(\r\n|\n|\r)/gm,""));
        if (hasKeyword(data.text)) {
            console.log('HAS KEYWORD'); console.log('HAS KEYWORD'); console.log('HAS KEYWORD');
        }

        soundCount++;
        if (soundCount >= 10) {
            soundCount = 0;
            player.play(function(err, player){
                console.log('playend!')
            });
        }
        var array = [];
        if (data.geo) {
            var coords = normalizeCoordinates(
                            [coordinates[0]+180,coordinates[1]+90],
                            [coordinates[2]+180,coordinates[3]+90],
                            [data.geo.coordinates[1]+180, data.geo.coordinates[0]+90]
                        );
            array.push({
                // x: ~~((data.geo.coordinates[1] + 180) / 360 * screenWidth),
                // y: screenHeight - ~~((data.geo.coordinates[0] + 90) / 180 * screenHeight),
                x: ~~(coords[0] * screenWidth+0.5),
                y: ~~(coords[1] * screenHeight+0.5),
                r: 10,
                g: 10,
                b: 255
            });
            if (0 <= array[0].y && array[0].y < screenHeight && 0 <= array[0].x && array[0].x < screenWidth) {
                var led = pixelScreen.image[array[0].y][array[0].x];

                led[0] = Math.min(led[0] + 200, 255);
                led[1] = Math.min(led[1] + 200, 255);
                led[2] = Math.min(led[2] + 200, 255);
                pixelScreen.forceUpdate();
            } else {
                console.log('Out of Bounds!', array,  data.geo);
            }
        }


    });
    stream.on('error', function (method, code) {
        console.log(arguments);
    })
});



function increaseUntil (inputVal, max, n) {
    var n = n || 1;
    return (inputVal < max) ? inputVal + n : max;
}
function reduceUntilMin (inputVal, min, n) {
    var min = min || 50;
    var n = n || 1;
    return (inputVal > min) ? inputVal - n : min;
}function reduceUntilZero (inputVal, n) {
    var n = n || 1;
    return (inputVal > n) ? inputVal - n : 0;
}
function reduceUntilMinOrZero (inputVal, min, n) {
    var min = min || 50;
    var n = n || 1;
    if (inputVal === 0) return 0;
    return (inputVal > min) ? Math.max(inputVal - n,min) : min;
}

var reduceInterval =  setInterval(function () {
    var array = [];
    for (var i = 0; i < screenHeight; i++) {
        array.push([]);
        for (var j = 0; j < screenWidth; j++) {
            array[i].push([
                reduceUntilMinOrZero(pixelScreen.image[i][j][0],3,15),
                reduceUntilMinOrZero(pixelScreen.image[i][j][1],3,15),
                reduceUntilMinOrZero(pixelScreen.image[i][j][2],15,15)
            ]);
        }
    }
    pixelScreen.update(array);
}, 33);

    // var saveInterval = setInterval(function () {
    //     saveToJSON(pixelScreen.image);
    // },5000);


    // function loadFromJSON () {
    //     var returnData;
    //     fs.readFile('worldmap.json', function (err, data) {
    //         if (err) console.log(err);
    //         console.log('worldmap loaded');
    //         if (data) pixelScreen.update(JSON.parse(data));
    //     });
    // }
    // loadFromJSON();

    // function saveToJSON (array) {
    //     // fs.writeFile('worldmap.json', JSON.stringify(array, undefined, 2), 'utf8', function (err) {
    //     fs.writeFile('worldmap.json', JSON.stringify(array), 'utf8', function (err) {
    //         if(err) console.log(err);
    //     });
    // }
