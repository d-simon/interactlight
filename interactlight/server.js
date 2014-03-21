var config = require('../config.js');

var http     = require('http')
  , connect  = require('connect')
  , express  = require('express')
  , socketio = require('socket.io')
  , path = require('path');

var app    = express()
var server = http.createServer(app)
var io     = socketio.listen(server)

var port = process.env.PORT|| 9001;
var host = process.env.HOST || '::';

server.listen(port, host, null, function() { });

io.set('log level', 1);

app.configure(function() {
    app.use(connect.json());
    app.use(express.logger('dev'));
    app.use(express.static(path.join(__dirname, 'app')));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

module.exports = { 'io': io, 'app': app, 'server': server };