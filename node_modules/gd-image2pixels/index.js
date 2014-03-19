module.exports = function(inputimg){
    var pixels = [];
    for(var i = 0; i < inputimg.height; i++)
    {
        pixels[i] = [];
        for(var j = 0; j < inputimg.width; j++)
        {
            var pixel = inputimg.getPixel(j,i);
            pixels[i][j] = {
                red: inputimg.red(pixel),
                green: inputimg.green(pixel),
                blue: inputimg.blue(pixel),
                raw: pixel
            };
        }
    }
    return pixels;
};