var clear = require('clear')
  , ansi = require('ansi')
  , cursor = ansi(process.stdout);

function Screen (width, height, spacing) {
    this.width = width || 40;
    this.height = height || 24;
    this.spacing = spacing || 0;
    this.screen = this.generateScreen();
};

Screen.prototype.Pixel = function (r, g, b) {
    this.r = (typeof r == 'number') ? r : 0;
    this.g = (typeof g == 'number') ? g : 0;
    this.b = (typeof b == 'number') ? b : 0;
};

Screen.prototype.generateScreen = function () {
    var screen = [];
    for (var i = 0; i < this.height; i++) {
        screen.push([]);
        for (var j = 0; j < this.width; j++) {
            screen[i].push(new this.Pixel());
        }
    }
    return screen;
};

Screen.prototype.update = function (array) {
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            this.screen[i][j] = new this.Pixel(array[i][j][0], array[i][j][1], array[i][j][2]);
        }
    }
};

Screen.prototype.updateFromDMX = function (obj, ledChannels) {
    var ledChannels = ledChannels || 3;
    for (channel in obj) {
        var channel = ~~channel
          , slot = ~~(channel / ledChannels)
          , y = ~~(slot / this.width)
          , x = slot % this.width
          , led = channel % ledChannels;

        if (ledChannels = 1) {
            this.screen[y][x].r = obj[channel]
            this.screen[y][x].g = obj[channel]
            this.screen[y][x].b = obj[channel]
        } else {
            switch (led) {
                case 0:
                    this.screen[y][x].r = obj[channel];
                    break;
                case 1:
                    this.screen[y][x].g = obj[channel];
                    break;
                case 2:
                    this.screen[y][x].b = obj[channel];
                    break;
                default:
                    break;
            }
        }

    };
};

Screen.prototype.paint = function () {
    clear();
    var paint = [];
    for (var i = 0; i < this.screen.length; i++) {
        for (var j = 0; j < this.screen[i].length; j++) {
            cursor.reset()
                .write(repeatStr('  ', this.spacing))
                .bg.rgb(this.screen[i][j].r, this.screen[i][j].g, this.screen[i][j].b)
                .write('  ');
        }
        cursor.reset().write('\n'+repeatStr('\n', this.spacing));
    }
};

function repeatStr (str, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 0) {
        if (count & 1) result += str;
        count >>= 1, str += str;
    }
    return result;
};

module.exports = Screen;