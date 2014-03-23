var pixelScreen = require('../screen-36x24.js')
  , fs = require('fs')
  , config = require('../config.js')
  , twitter = require('ntwitter')
  , twit = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});



function WorldMap () {
    this.width = pixelScreen.width;
    this.height = pixelScreen.height;
    this.defaultCoordinates = [-180,-80,180,90];
    this.coordinates = [-180,-80,180,90];
    this.running = false;
};

WorldMap.prototype.normalizeCoordinates = function(A, B, C) {
    // A = lowerLeft BoundingPoint
    // B = upperRight BoundingPoint
    // C = Point
    return [(C[0] - A[0]) / (B[0] - A[0]), (C[1] - B[1]) / (A[1] - B[1])];
};

WorldMap.prototype.start = function (coords, slow, cb) {
    var that = this;
    var slowMode = !!slow;
    var callback = (typeof cb === 'function') ? cb : false;
    if (coords && coords.length === 4) { this.coordinates = coords; } else { this.coordinates = this.defaultCoordinates; }
    twit.stream('statuses/filter',
        {
            filter_level:'none',
            locations: this.coordinates.join(',')
        },
        function (stream) {
            that.stream = stream;
            that.running = true;

            stream.on('data', function (data) {
                //if (data) console.log(data.user.name, data.text.replace(/(\r\n|\n|\r)/gm,""));
                var array = [];
                if (data.geo) {
                    var coords = that.normalizeCoordinates(
                                    [that.coordinates[0]+180, that.coordinates[1]+90],
                                    [that.coordinates[2]+180, that.coordinates[3]+90],
                                    [data.geo.coordinates[1]+180, data.geo.coordinates[0]+90]
                                );
                    array.push({
                        x: ~~(coords[0] * that.width+0.5),
                        y: ~~(coords[1] * that.height+0.5),
                        r: 10,
                        g: 10,
                        b: 255
                    });
                    if (0 <= array[0].y && array[0].y < that.height && 0 <= array[0].x && array[0].x < that.width) {
                        var led = pixelScreen.image[array[0].y][array[0].x];
                        if (slowMode === true) {
                            led[0] = Math.min(led[0] + 1, 255);
                            led[1] = Math.min(led[1] + 1, 255);
                            led[2] = Math.min(led[2] + 1, 255);
                        } else {
                            led[0] = Math.min(led[0] + 200, 255);
                            led[1] = Math.min(led[1] + 200, 255);
                            led[2] = Math.min(led[2] + 200, 255);
                        }
                        pixelScreen.forceUpdate();
                    } else {
                        console.log('Out of Bounds!', array,  data.geo);
                    }
                }
                // TweetCallback
                if (cb) cb(data);
            });

        });

    if (slowMode !== true) {
        this.reduceInterval = setInterval(function () {
            var array = [];
            for (var i = 0; i < that.height; i++) {
                array.push([]);
                for (var j = 0; j < that.width; j++) {
                    array[i].push([
                        that.reduceUntilMinOrZero(pixelScreen.image[i][j][0],3,15),
                        that.reduceUntilMinOrZero(pixelScreen.image[i][j][1],3,15),
                        that.reduceUntilMinOrZero(pixelScreen.image[i][j][2],15,15)
                    ]);
                }
            }
            pixelScreen.update(array);
        }, 33);
    }
};

WorldMap.prototype.stop = function () {
    if (this.running) {
        this.stream.destroy();
        clearInterval(this.reduceInterval);
    }
    this.running = false;
};

WorldMap.prototype.twitterCallback = function (data) {
    if (data) console.log(data.user.name, data.text.replace(/(\r\n|\n|\r)/gm,""));
    var array = [];
    if (data.geo) {
        var coords = this.normalizeCoordinates(
                        [this.coordinates[0]+180, this.coordinates[1]+90],
                        [this.coordinates[2]+180, this.coordinates[3]+90],
                        [data.geo.coordinates[1]+180, data.geo.coordinates[0]+90]
                    );
        array.push({
            x: ~~(coords[0] * this.width+0.5),
            y: ~~(coords[1] * this.height+0.5),
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
};


WorldMap.prototype.increaseUntil = function (inputVal, max, step) {
    var n = step || 1;
    return (inputVal < max) ? inputVal + n : max;
};
WorldMap.prototype.reduceUntilMin = function (inputVal, minimum, step) {
    var min = minimum || 50;
    var n = step || 1;
    return (inputVal > min) ? inputVal - n : min;
};
WorldMap.prototype.reduceUntilZero = function (inputVal, step) {
    var n = step || 1;
    return (inputVal > n) ? inputVal - n : 0;
};
WorldMap.prototype.reduceUntilMinOrZero = function (inputVal, minimum, step) {
    var min = minimums || 50;
    var n = step || 1;
    if (inputVal === 0) return 0;
    return (inputVal > min) ? Math.max(inputVal - n,min) : min;
};

module.exports = WorldMap;
