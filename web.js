var express = require('express'),
    jade = require('jade'),
    path = require('path');

var app = express.createServer(express.logger());
app.configure(function(){
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.set('view options');
  var oneYear = 31557600000;
  app.use("/", express.static(__dirname + '/public'));
  app.use(express.bodyParser());
});

app.get('/', function(request,response){
  response.render('layout', {
      locals: {some: 'Locals'}
  });
});

var port = process.env.PORT || 3000;
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
