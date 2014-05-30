module.exports = function (pixelScreen, util, i2p, deepcopy, fileConfig) {

    console.log('Loading...');
    function iterateAsync (i, length, func, callback) {
        if (i < length ) {
            func(i, function cb () {
                iterateAsync(i+1, length, func, callback);
            });
        } else {
            if (callback && typeof callback === 'function') callback();
        }
    }

    function loadAllFiles (fileCallback) {
        iterateAsync(0, fileConfig.length,
            function (i, iterateCallback) {
                var current = fileConfig[i];

                if (!current.images) {
                    current.images = [];
                    current.files = [];

                    for (var j = 0; j < current.end - current.start; j++) {
                        current.files[j] = current.prefix + util.padString(j+current.start,6) + current.suffix;
                    }

                    // Iterate
                    iterateAsync(0, current.files.length,
                        function (i, callback) {
                            var filename = current.files[i];
                            i2p(filename, { pixelsCallback: util.convertI2PtoPixelScreen }, function (err, pixels) {
                                current.images[i] = deepcopy(pixels);
                                if (callback && typeof callback == 'function') callback();
                            });
                        },
                        function cb () {
                            console.log('Video ' + i +' loaded');
                            if (iterateCallback && typeof iterateCallback == 'function') iterateCallback();
                        }
                    );
                } else {
                    console.log('Video ' + i +' is already loaded');
                    if (iterateCallback && typeof iterateCallback == 'function') iterateCallback();
                }
            },
            function mainCb () {
                console.log('done');
                if (fileCallback && typeof fileCallback == 'function') fileCallback(null, fileConfig);
            }
        );
    }

    function LoopPlayer () {
        var that = this;
        this.fileConfig = fileConfig;
        loadAllFiles(function (err, result) {
            that.fileConfig = result;
            console.log(arguments);
        });
        this.running = false;
        this.loopCount = 0;
    };

    LoopPlayer.prototype.play = function (video, callback) {
        var that = this;
        if (this.fileConfig[video]) {
            this.current = this.fileConfig[video];
            this.loop();
        }
    };

    LoopPlayer.prototype.loop = function () {
        var that = this;
        this.running = true;
        this.playInterval = setInterval(function () {
            pixelScreen.update(that.current.images[that.loopCount]);
            that.loopCount++;
            if (that.loopCount >= that.current.end - that.current.start) that.loopCount = 0;
        },1000/this.current.fps);
    }

    LoopPlayer.prototype.stop = function () {
        if (this.running) {
            clearInterval(this.playInterval);
        }
        this.running = false;
    };

    return LoopPlayer;
};