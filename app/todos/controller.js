var Todo = require('../../models/todos');

module.exports = (function (io) {
  TodoAPI = {
    // post '/todos'
    create: function (req, res) {
      Todo.createItem(req.body.title, req.body.completed, function (todo) {
        io.sockets.emit('todo/new', todo);
        res.json(todo);
      });
    },

    // get '/todos'
    readAll: function (req, res) {
      Todo.findAll(function (todos) {
        res.json(todos);
      });
    },

    // get '/todos/:id'
    read: function (req, res) {
      Todo.findById(req.params.id, function (todo) {
        res.json(todo);
      });
    },

    // put '/todos/:id'
    update: function (req, res) {
      Todo.findById(req.params.id, function (todo) {
        if (todo) {
          todo.updateItem(req.body.title, req.body.completed, function () {
            io.sockets.emit('todo/'+todo.id+'/update', todo);
          });
        }
        res.json(todo);
      });
    },

    // delete '/todos/:id'
    remove: function (req, res) {
      Todo.findById(req.params.id, function (todo) {
        if (todo) {
          todo.remove();
          io.sockets.emit('todo/'+todo.id+'/destroy', todo);
        }
        res.json(todo);
      });
    }
  }

  return TodoAPI;
});
