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
