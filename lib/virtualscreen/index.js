String.prototype.repeat = function (count) {
    if (count < 1) return '';
    var result = '', pattern = this.valueOf();
    while (count > 0) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result;
};

var clear = require('clear')
  , ansi = require('ansi')
  , cursor = ansi(process.stdout);

function Screen (width, height, spacing) {
    if (width) this.width = width;
    if (height) this.height = height;
    this.spacing = spacing || 0;
    this.screen = this.generateScreen();
};

Screen.prototype.width = 256;
Screen.prototype.height = 256;



Screen.prototype.Pixel = function (r, g, b) {
    this.r = (typeof r == 'number') ? r : 255;
    this.g = (typeof g == 'number') ? g : 255;
    this.b = (typeof b == 'number') ? b : 255;
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

Screen.prototype.update = function (obj) {
    for (var px in obj) {
        this.screen[obj[px].y][obj[px].x] = new this.Pixel(obj[px].r, obj[px].b, obj[px].b);
    }
};

Screen.prototype.updateDMX = function (obj) {
    for (channel in obj) {
        var channel = ~~channel
          , slot = ~~(channel / 3)
          , y = ~~(slot / this.width)
          , x = slot % this.width
          , led = channel % 3;
        //console.log(channel, slot, x, y, led);

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

    };
};

Screen.prototype.paint = function () {

    clear();
    var paint = [];
    for (var i = this.screen.length - 1; i >= 0; i--) {
        //paint.push([])
        for (var j = 0; j < this.screen[i].length; j++) {
            cursor
                .reset()
                .write('  '.repeat(this.spacing))
                .bg.rgb(this.screen[i][j].r, this.screen[i][j].g, this.screen[i][j].b)
                .write('  ');
        }
        cursor.reset().write('\n'+'\n'.repeat(this.spacing));
    }
};

module.exports = Screen;