var express = require('express'),
    app = express();

module.exports = (function (io) {
  var api = require('./controller')(io);

  app.configure(function () {
    /* Routes */
    app.post('/todos', api.create);
    app.get('/todos', api.readAll);
    app.get('/todos/:id', api.read);
    app.put('/todos/:id', api.update);
    app.delete('/todos/:id', api.remove);
  });

  return app;
});
