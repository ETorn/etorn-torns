//var rpio = require('rpio');
var _ = require('lodash');
var http = require('http');
var express = require('express');
var cors = require('cors');
var WebSocketServer = require('websocket').server;
var request = require('request');

// rpio.init();
//
// rpio.open(40, rpio.INPUT,rpio.PULL_UP);
//
// rpio.poll(40, _.throttle(function(pin) {
//     console.log('pressed', Date.now());
// }, 500, {trailing: false}), rpio.POLL_LOW);

var address = 'http://localhost:8080';

var storeId = '58d3a4fd9b48fd0bf0d2f09a';

var advanceStoreTurn = function advanceStoreTurn(storeId, cb) {
  request({
    url: address + "/stores/" + storeId + '/storeTurn',
    method: 'PUT',
    json: true,
    body: {}
  }, function(err, res, body) {
    cb(err, body.storeTurn);
  });
};

var getStoreTurn = function getStoreTurn(storeId, cb) {
  request({
    url: address + "/stores/" + storeId,
    method: 'GET',
    json: true,
    body: {}
  }, function(err, res, body) {
    cb(err, body.storeTurn);
  });
};

var app = express();

app.use(express.static("site"));
app.use(cors());

app.get("/", function(req, res){
    res.sendFile(__dirname + "/site/index.html");
});

app.server = http.createServer(app);

app.server.listen(80, function(err) {
  console.log('Listening on :80');
});

var wsServer = new WebSocketServer({
  httpServer: app.server
});

var browser;

wsServer.on('request', function(request) {
  browser = request.accept(null, request.origin);

  browser.send(JSON.stringify({storeTurn: '...'}));

  browser.on('message', function(message) {
    console.log('mesage');
    if (message.type === 'utf8') {
      console.log('Message utf-8');
      var json = JSON.parse(message.data);
      console.log(json);
    }
  });

  browser.on('close', function(connection) {
    console.log('close');
    browser = null;
  });
});

var turn = 0;

setInterval(function(){
  getStoreTurn(storeId, function(err, res) {
    if (res !== turn) {
      turn = res;

      if (browser)
        browser.send(JSON.stringify({storeTurn: turn}));
    }
  });
}, 500);
