var express = require('express'),
    api = require('./controller'),
    app = module.exports = express();

app.configure(function () {
  /* Config */
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false });

  /* Routes */
  app.get('/', api.home);
});
