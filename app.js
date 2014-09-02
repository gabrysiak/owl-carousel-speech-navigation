'use strict';

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var assetmanager = require('assetmanager');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.set('showStackError', true);

// Enable jsonp
app.enable('jsonp callback');

var assets = assetmanager.process({
    assets: require('./config/assets.json'),
    debug: (process.env.NODE_ENV !== 'production'),
    webroot: 'public'
});

// Add assets to local variables
app.locals.assets = assets;

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./routes') (app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
