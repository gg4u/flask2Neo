'use strict';
// Declare app level module which depends on filters, and services

var discovery = angular.module('Discovery', [
  	'ngRoute',
  	'ngCookies'
])

discovery.factory("NodeManager", function($http) {

	var game_instance = {
		points:0,
		steps:[]
	};

	game_instance.get = function(id,completionHandler) {
		//Here make get of news
		$http.get('http://localhost:3000/api/v1/1/node/'+id).success(function(result) {
			if(result.success)
			  	completionHandler(result.data)
			else
			  	completionHandler(null)
		});
	};

	game_instance.neighborgs = function(id,_limit,_offset,completionHandler) {
		//Here make get of news
		$http.post('http://localhost:3000/api/v1/1/node/'+id+'/neighborgs',{
			limit:_limit,
			offset:_offset
		}).success(function(result) {
			if(result.success)
			  	completionHandler(result.data)
			else
			  	completionHandler(null)
		});
	};

	game_instance.user_metrics = function(id,_limit,_offset,completionHandler) {
		//Here make get of news
		$http.post('http://localhost:3000/api/v1/1/node/'+id+'/user',{
			limit:_limit,
			offset:_offset
		}).success(function(result) {
			if(result.success)
			  	completionHandler(result.data)
			else
			  	completionHandler(null)
		});
	};

	return game_instance;
})

discovery.controller('gameSelectionController', function($scope, $routeParams, NodeManager) {

	var data = [
	{	
		start_node: "Titolo 1",
		end_node: "Titolo 2",
		start_identifier: "100",
		end_identifier: "200",
		thumbnail:""
	},{	
		start_node: "Titolo 3",
		end_node: "Titolo 4",
		start_identifier: "100",
		end_identifier: "200",
		thumbnail:""
	},{	
		start_node: "Titolo 5",
		end_node: "Titolo 6",
		start_identifier: "100",
		end_identifier: "200",
		thumbnail:""
	},{	
		start_node: "Titolo 5",
		end_node: "Titolo 6",
		start_identifier: "100",
		end_identifier: "200",
		thumbnail:""
	}]

	var _searchResult = [];

	for(var i=0;i<data.length;i++)
	{	
		try {
			_searchResult.push(data[i])
		} catch (ex) {
			console.log(ex)
		}
	}

	$scope.searchResult = _searchResult;
});



discovery.controller('searchResultController', function($scope, $routeParams, NodeManager) {

	NodeManager.get("2638",function(data) {
		if (!data) 
			alert("Error retriving nodes")

		var _searchResult = []

		for(var i=0;i<data.length;i++)
		{	
			try {
				_searchResult.push(data[i].product.properties)
			} catch (ex) {
				console.log(ex)
			}
		}

		$scope.searchResult = _searchResult;
	})	
});


$(document).ready(function() {

	$(document).on("click",".play-button",function() {
		alert("Route to play")

		window.location.href = "/graph"

		return false;
	})

})