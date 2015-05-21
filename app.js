var express = require('express')
var bodyParser = require('body-parser')
var stylus = require('stylus')
var fs = require('fs')
var expressCors = require('express-cors')
var logger = require('morgan');
var http = require('http');
var nib = require('nib')
var bootstrap = require('bootstrap-styl')
var cookieParser = require('cookie-parser')
var expressCors = require('express-cors')
var crypto = require('crypto')

var search_manager = require('./search')
var routerManager = require('./routerManager');

var app = express()
app.locals = {
    environment:process.env.NODE_ENV.toLowerCase()
};

function compile(str, path) {
    return stylus(str).set('filename',path).use(nib()).use(bootstrap());
}

app.set('views', [__dirname + '/views'])
app.set('view engine','jade')
app.use(logger('tiny'))

var port = process.env.NODE_ENV.toLowerCase() == "production"? process.env.PORT : 3000;

app.set('port',port)

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())

app.use(stylus.middleware({ 
    src: __dirname + '/public', 
    compile: compile
}))
app.use(express.static(__dirname+'/public'))
app.use(expressCors({
    allowedOrigins: ['http://localhost:*','http://*.herokuapp.com:*','https://*.herokuapp.com:*']
}));

app.use(express.static(__dirname+'/public'))

app.get('/api/v1/:network/node/search/', function (req,res) {
	search_manager.search_node({
		name:'DNA'
	},function (data) {
		res.json(data)
	})
})

app.get('/api/v1/:network/node/:identifier', function (req,res) {
	search_manager.get_node(parseInt(req.params.identifier),function(data) {
		res.json(data)
	})
})

app.post('/api/v1/:network/node/:identifier/user', function (req,res) {
	search_manager.user_metrics(_node,_user,_type,completionHandler,function(data){
		res.json(data)
	})
})

app.get('/api/v1/:network/node/:identifier/details', function (req,res) {
	res.json({success:true,data:null})
})

app.post('/api/v1/:network/node/:identifier/neighbors', function (req,res) {
	var _limit=25
	var _offset=0

	if (req.body.limit!==undefined && req.body.limit!="") 
		_limit = parseInt(req.body.limit)

	if (req.body.offset!==undefined && req.body.offset!="") 
		_offset = parseInt(req.body.offset)

	search_manager.get_node_neighbors(parseInt(req.params.identifier),_limit,_offset,function(data) {
		res.json(data)
	})
})

app.get('*', routerManager.graphHandler)

app.listen(app.get('port'), function () {
    console.log('Bitrace.io server listening on port ' + app.get('port'));
});