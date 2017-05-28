var optional = require('optional');
var rpio = optional('rpio');
var _ = require('lodash');
var http = require('http');
var express = require('express');
var cors = require('cors');
var WebSocketServer = require('websocket').server;
var request = require('request');
var mqtt = require('mqtt');

var config = require('./config');


var address = config.node.address;

var storeId = config.node.storeId;

var mqttClient = mqtt.connect(config.mqtt.address);

mqttClient.subscribe('etorn/store/' + storeId + '/storeTurn');

mqttClient.on('message', function(topic, message) {
  console.log('Got turn', message.toString());
  setTurn(message.toString());
});

var browser;
var setTurn = function setTurn(t) {
  if (browser)
    browser.send(JSON.stringify({storeTurn: t}));
};

var advanceStoreTurn = function advanceStoreTurn(storeId, cb) {
  request({
    url: config.node.address + "/stores/" + storeId + '/storeTurn',
    method: 'PUT',
    json: true,
    body: {}
  }, function(err, res, body) {
    cb(err, body.storeTurn);
  });
};

var getStoreTurn = function getStoreTurn(storeId, cb) {
  request({
    url: config.node.address + "/stores/" + storeId,
    method: 'GET',
    json: true,
    body: {}
  }, function(err, res, body) {
    cb(err, body.storeTurn);
  });
};

var buttonPress = function buttonPress() {
  console.log('pressed', Date.now());
  mqttClient.publish('etorn/store/' + storeId + '/advance');
}

var app = express();

app.use(express.static("site"));
app.use(cors());

app.get("/", function(req, res){
    res.sendFile(__dirname + "/site/index.html");
});

app.server = http.createServer(app);

app.server.listen(8081, function(err) {
  console.log('Listening on :8081');
});

var wsServer = new WebSocketServer({
  httpServer: app.server
});

wsServer.on('request', function(request) {
  browser = request.accept(null, request.origin);

  browser.send(JSON.stringify({storeTurn: '...'}));

  mqttClient.publish('etorn/store/' + storeId + '/idk');

  browser.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log('Message utf-8');
      var json = JSON.parse(message.utf8Data);

      if (json.type === 'click')
        buttonPress();
    }
  });

  browser.on('close', function(connection) {
    console.log('close');
    browser = null;
  });
});

if (rpio) {
  rpio.init();

  rpio.open(40, rpio.INPUT,rpio.PULL_UP);

  rpio.poll(40, _.throttle(function(pin) {
    buttonPress();
  }, 500, {trailing: false}), rpio.POLL_LOW);
}
