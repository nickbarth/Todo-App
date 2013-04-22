;(function (window, app, undefined) {
  'use strict';

  app = app || {};
  app.socket = io.connect();

  app.Todo = Backbone.Model.extend({
    idAttribute: '_id',
    urlRoot: 'todos',
    defaults: function () {
      return {
        title: '',
        completed: false,
        selected: false
      };
    }
  });

  app.TodoList = Backbone.Collection.extend({
    model: app.Todo,
    url: 'todos',
    add: function (newTodo) {
      var dupl = this.any(function(todo) {
        return newTodo.id === todo.id;
      });
      if (!dupl && newTodo.id) {
        return Backbone.Collection.prototype.add.call(this, newTodo);
      }
    }
  });

  app.TodoView = Backbone.View.extend({
    tagName: 'li',
    className: 'todo-item',
    template: Handlebars.compile($('#todo-template').text()),
    events: {
      'click .edit-item'   : 'editTodo',
      'click .remove-item' : 'removeTodo',
      'click .checkbox'    : 'toggleTodo'
    },
    initialize: function () {
      this.model.on('change', this.render, this);
      this.model.on('update', this.update, this);
      app.socket.on('todo/'+this.model.id+'/update', this.update.bind(this));
      app.socket.on('todo/'+this.model.id+'/destroy', this.removeTodo.bind(this));
    },
    update: function (data) {
      this.model.set('completed', data.completed);
      this.model.set('title', data.title);
    },
    editTodo: function () {
      editTodoView.loadTodo(this.model.id);
      return false;
    },
    removeTodo: function () {
      app.socket.removeAllListeners('todo/'+this.model.id+'/update');
      this.model.destroy();
      this.model.off();
      this.unbind();
      this.remove();
      return false;
    },
    toggleTodo: function () {
      this.model.set({ completed: !!!this.model.get('completed') });
      this.model.save();
      return false;
    },
    render: function () {
      this.model.get('selected') ? this.$el.addClass('selected') : this.$el.removeClass('selected');
      this.model.get('completed') ? this.$el.addClass('completed') : this.$el.removeClass('completed');
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  app.TodoListView = Backbone.View.extend({
    el: $('.todo-list'),
    initialize: function () {
      this.collection.on('add', this.addTodo, this);
      app.socket.on('todo/new', (function(data){this.collection.add(new app.Todo(data))}).bind(this));
    },
    addTodo: function (todo) {
      var todoView = new app.TodoView({model: todo});
      this.$el.append(todoView.render().el);
    },
    render: function () {
      return this;
    }
  });

  app.EditTodoView = Backbone.View.extend({
    el: $('.todo-form'),
    events: {
      'click .publish-item' : 'createTodo',
      'click .save-item'    : 'saveTodo',
      'click .cancel-item'  : 'cancel'
    },
    initialize: function () {
      this.$titleEl = this.$el.find('.todo-title');
      this.$saveBtn = this.$el.find('.save-item');
      this.$cancelBtn = this.$el.find('.cancel-item');
      this.$publishBtn = this.$el.find('.publish-item');
      this.$todoHeaderEl = this.$el.find('.todo-form-header');
    },
    setEditView: function () {
      this.$todoHeaderEl.text('Update Item');
      this.$titleEl.val(this.model.get('title'));
      this.$publishBtn.css({ display: 'none' });
      this.$saveBtn.css({ display: 'inline-block' });
      this.$cancelBtn.css({ display: 'inline-block' });
    },
    setPublishView: function () {
      this.$todoHeaderEl.text('Add New Item');
      this.$titleEl.val('');
      this.$publishBtn.css({ display: 'block' });
      this.$saveBtn.css({ display: 'none' });
      this.$cancelBtn.css({ display: 'none' });
    },
    loadTodo: function (todoId) {
      this.model.off('destroy', this.cancel);
      this.model.set('selected', false);
      this.model = todoList.get(todoId);
      this.model.set('selected', true);
      this.model.on('destroy', this.cancel, this);
      this.setEditView();
    },
    createTodo: function () {
      todoList.create({ title: this.$titleEl.val() })
      this.cancel();
      return false;
    },
    saveTodo: function () {
      this.model.set({ title: this.$titleEl.val() });
      this.model.save();
      this.cancel();
      return false;
    },
    cancel: function () {
      this.model.set('selected', false);
      this.model.off('destroy', this.cancel);
      this.model = new app.Todo();
      this.setPublishView();
      return false;
    }
  });

  var todoList = new app.TodoList(),
      todoListView = new app.TodoListView({collection: todoList}),
      editTodoView = new app.EditTodoView({model: new app.Todo()});

  todoList.fetch();
})(window, window.app);
