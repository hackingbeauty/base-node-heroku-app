var express = require('express')  
  , mongoose = require('mongoose')
  , todo = require('./models/todo')
  , routes = require('./routes')
  , sockets = require('./sockets')
  , connect = require('express/node_modules/connect')
  , RedisStore = require('connect-redis')(express)
  , sessionStore = new RedisStore()
  , app = express.createServer()
  , sio;

app.configure(function () {
  app.set('views', __dirname + '/views'); 
  app.set('view engine','jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({
    secret: 'keyboard cat',
    key: 'express.sid',
    store: sessionStore
  }));
  app.use(app.router);
});

app.configure('development', function () {
  app.use(express.errorHandler());
  app.set('view options', {pretty: true});
});

routes.init(app);
mongoose.connect("127.0.0.1", "todomvc", 27017);

app.listen(8888);

sio = require('socket.io').listen(app);
sockets.init(sio, sessionStore);

console.log("Express server listening on port 8888");

