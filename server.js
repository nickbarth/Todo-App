var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

app.configure(function(){
  app.set('view engine', 'ejs');
  app.use('/', express.static(__dirname + '/public'));
  app.use(express.bodyParser());
});

app.use(require(__dirname + '/app/main'));
// app.use(require(__dirname + '/app/forms')(io));
app.use(app.router);

module.exports = server;
