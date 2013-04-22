var mongoose = require('mongoose'),
    TodoSchema = null,
    Todo = null;

/* Todo Schema */
TodoSchema = mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, required: true },
});

// Creates a new todo item.
//
// title - Set as new todos title.
// completed - Set as new todos completed.
// callback
//
// Returns callback with either the new todo or false if there wan an error.
TodoSchema.statics.createItem = (function (title, completed, callback) {
  var todo = new Todo({
    title: title,
    completed: completed
  });
  todo.save(function (err) {
    if (err) {
      console.log(err);
      return callback(false);
    } else {
      return callback(todo);
    }
  });
});

// Find by Id.
//
// id - Looks up a todo by a given id.
// callback
//
// Returns callback with either the found and verified todo or false.
TodoSchema.statics.findById = (function (id, callback) {
  this.findOne({ _id: id }, function (err, todo) {
    if (err || !todo) return callback(false);
    return callback(todo);
  });
});

// Find all.
//
// callback
//
// Returns callback with either the found and verified todos or false.
TodoSchema.statics.findAll = (function (callback) {
  this.find({}, function (err, todos) {
    if (err || !todos) return callback(false);
    return callback(todos);
  });
});

// Updates a todos title, and completed.
//
// title - Set as todos title.
// completed - Set as todos completed.
// callback
//
// Returns and calls callback when saved.
TodoSchema.methods.updateItem = (function (title, completed, callback) {
  this.title = title || this.title;
  this.completed = completed;
  this.save(function (err) {
    return callback();
  });
});

Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;
