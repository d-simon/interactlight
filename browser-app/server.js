var config = require('./config.js');

var http     = require('http')
  , connect  = require('connect')
  , express  = require('express')
  , socketio = require('socket.io')
  , path = require('path');

var app    = express();
var server = http.createServer(app);
var io     = socketio.listen(server);

var listen_port = process.env.PORT|| 9001;
var listen_host = process.env.HOST || '::';

server.listen(listen_port, listen_host, null, function() { });

io.set('log level', 1);

app.configure(function() {
    app.use(connect.json());
    app.use(express.logger('dev'));
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var twitter = require('ntwitter');
var twit = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});
// language: ['en,ru'],
// twit.stream('statuses/filter', {filter_level:'medium', track: ['ukraine' , 'obama ukraine', 'krim obama', 'obama']}, function(stream) {
//     stream.on('data', function(data) {
//         if (data) console.log('ukraine', data.text.replace(/(\r\n|\n|\r)/gm,""));
//         io.sockets.emit('tweet', { tag: 'russia', data: data });
//     });
// });

// twit.stream('statuses/filter', {filter_level:'medium', track: ['russia', 'putin ukraine', 'krim putin', 'putin']}, function(stream) {
//     stream.on('data', function(data) {
//         if (data) console.log('russia ', data.text.replace(/(\r\n|\n|\r)/gm,""));
//         io.sockets.emit('tweet', { tag: 'russia', data: data });
//     });
// });
twit.stream('statuses/filter', {filter_level:'none', track: ['cat', 'cats', 'dogs', 'dog', 'hampster', 'meow']}, function(stream) {
    stream.on('data', function(data) {
        if (data) console.log('russia ', data.text.replace(/(\r\n|\n|\r)/gm,""));
        io.sockets.emit('tweet', { tag: 'cats', data: data });
    });
});

twit.stream('statuses/sample', {filter_level:'none'}, function(stream) {
    stream.on('data', function(data) {
        if (data) console.log('all ', data.text.replace(/(\r\n|\n|\r)/gm,""));
        io.sockets.emit('tweet', { tag: 'all', data: data });
    });
});
