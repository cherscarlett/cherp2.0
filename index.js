'use strict';

require('babel-polyfill');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _connect = require('connect');

var _connect2 = _interopRequireDefault(_connect);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _nodeRequire = require('marko/node-require');

var _nodeRequire2 = _interopRequireDefault(_nodeRequire);

var _components = require('marko/components');

var _components2 = _interopRequireDefault(_components);

var _router = require('./lib/router');

var _router2 = _interopRequireDefault(_router);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var port = process.env.PORT || '9001'; // It's over 9000

var app = (0, _connect2.default)();
var server = _http2.default.createServer(app);
var io = new _socket2.default(server);

_nodeRequire2.default.install();

app.use((0, _compression2.default)()).use('/skills', function (request, response) {
    return _router2.default.page(request, response, io);
}).use('/resume', function (request, response) {
    return _router2.default.page(request, response, io);
}).use('/pub', function (request, response) {
    return _router2.default.page(request, response, io);
}).use('/', function (request, response) {
    return _router2.default.index(request, response, io);
});

server.listen(port, function (err) {
    if (err) {
        return console.error('There was an error: ' + err);
    }
    console.log('Listening on port: ' + port);
});

module.exports = app;
