var express = require('express'),
    jade = require('jade'),
    path = require('path'),
    mongoose = require('mongoose');

var app = express(express.logger());
app.configure(function(){
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.set('view options');
  app.locals.pretty = true;  
  app.use("/", express.static(__dirname + '/public'));
  app.use(express.bodyParser());
});

mongoose.connect("mongodb://localhost/my_database");

var Todo = mongoose.model("Todo", new mongoose.Schema({
  text: String,
  done: Boolean,
  order: Number
 }));

app.get('/', function(request,response){
  response.render('layout', {
      locals: {some: 'Locals'}
  });
});

app.get('/todo', function(req, res){
  res.render('todo', {title: "Our sample application"});
});

app.get('/api/todos', function(req, res){ return Todo.find(function(err, todos) {
  return res.send(todos); });
});

app.get('/api/todos/:id', function(req, res){
  return Todo.findById(req.params.id, function(err, todo) {
    if (!err) {
      return res.send(todo); }
    }); 
});

app.put('/api/todos/:id', function(req, res){
  return Todo.findById(req.params.id, function(err, todo) {
    todo.text = req.body.text; 
    todo.done = req.body.done; 
    todo.order = req.body.order;
    return todo.save(function(err) {
      if (!err) { 
        console.log("updated");
      }
      return res.send(todo); });
    }); 
});

app.post('/api/todos', function(req, res){ 
  var todo;
  todo = new Todo({
     text: req.body.text,
     done: req.body.done,
     order: req.body.order
  }); 
  todo.save(function(err) {
    if (!err) {
      return console.log("created"); 
    }
  });
  return res.send(todo); 
});

app.delete('/api/todos/:id', function(req, res){
  return Todo.findById(req.params.id, function(err, todo) {
    return todo.remove(function(err) { 
      if (!err) {
        console.log("removed");
        return res.send('') 
      }
    }); 
  });
});


var port = process.env.PORT || 8888;
app.listen(port, function(){
  console.log("listening on " + port);
});

// var redis = require('redis-url').connect(process.env.REDISTOGO_URL);
// 
// redist.set('foo','bar');
// 
// redis.get('foo', function(err,value){
//   console.log('foo is: ' + value);
// });
