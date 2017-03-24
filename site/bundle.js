(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var updateDisplay = function updateDisplay(i) {
  document.querySelector('#torn').textContent = i;
};

var connection;

var doConnect = function doConnect() {
  console.log('connecting...');
  connection = new WebSocket('ws://127.0.0.1:80');

  connection.onopen = function () {
    console.log('open');
  };

  connection.onerror = function (error) {
    console.log('error');
    doConnect();
  };

  connection.onmessage = function (message) {
    console.log('message');
    var json = JSON.parse(message.data);

    if (json.storeTurn)
      updateDisplay(json.storeTurn);
  };
};

doConnect();

},{}]},{},[1]);
