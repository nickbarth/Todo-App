process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var newrelic = require('newrelic'),
    mongoose = require('mongoose'),
    server = require('./server'),
    mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/todo-app',
    port = process.env.PORT || 80;

mongoose.connect(mongoUri, {db: { safe: true }});

server.listen(port, function () {
  console.log('Server listening on port ' + port);
});
