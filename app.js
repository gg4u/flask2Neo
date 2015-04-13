var express = require('express')
var bodyParser = require('body-parser')
var expressCors = require('express-cors')
var logger = require('morgan');
var http = require('http');

var search_manager = require('./search')

var app = express()

app.use(logger('dev'))

var port = process.env.NODE_ENV.toLowerCase() == "production"? process.env.PORT : 3000;

app.set('port',port)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(expressCors({
	allowedOrigins: ['null','http://localhost:*','http://*.xdiscovery.com:*']
}))

app.listen(app.get('port'), function () {
  	console.log('Discovery-API Server listening on port ' + app.get('port'));
});

app.get('/api/v1/:network/node/search/', function (req,res) {
	search_manager.search_node({
		name:'Tavolino Pr'
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

app.get('*', function(req,res) {
	res.send("");
}); 