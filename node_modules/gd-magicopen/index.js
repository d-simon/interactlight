var gd = require('node-gd'),
    mmm = require('mmmagic'),
    Magic = mmm.Magic;

module.exports = function(filename, callback)
{
    var magic = new Magic(mmm.MAGIC_MIME_TYPE);
    magic.detectFile(filename, function(err, result) {
        if (err) throw err;
        if(result == "image/jpeg")
        {
            gd.openJpeg(filename, callback);
        }
        else if(result == "image/png")
        {
            gd.openPng(filename, callback);
        }
        else if(result == "image/gif")
        {
            gd.openGif(filename, callback);
        }
        else if(result == "image/vnd.wap.wbmp")
        {
            gd.openWbmp(filename, callback);
        }
        else
        {
            callback({name: "FiletypeError", message: "Not a valid image file"});
        }
    });
};
