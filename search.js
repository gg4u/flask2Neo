var es = require("elasticsearch")
var neo4j = require('neo4j');

graph = new neo4j.GraphDatabase('http://localhost:7474');
client = new es.Client;

exports.search_node = function (terms,completionHandler)  {

	client.search({
	  	index: 'jesproduct',
	  	type: 'string',
	  	body: {
	    	query: {
	    		match:terms
	    	}
	  	}
	}).then(function (resp) {
    	var hits = resp;
    	
    	if ((completionHandler !== undefined) && (typeof(completionHandler) == "function"))
			completionHandler({success:true,data:hits})

	}, function (err) {
    	console.trace(err.message);

    	if ((completionHandler !== undefined) && (typeof(completionHandler) == "function"))
			completionHandler({success:false,errorCode:"Error while getting data from ElasticSearch"})    	
	});

}

exports.user_metrics = function(_node,_user,_type,completionHandler) {
	//type can be START,END(,HOP)

	graph.cypher({
		query: 'MATCH (product:Product) WHERE product.identifier = {identifier} CREATE UNIQUE (user:User {identifier:{u_identifier}})-[:'+_type.toUpperCase()+']->(product) RETURN user',
		params: {
			identifier: _node,
			u_identifier: _user,
			type: _type
		}
	}, function (err, results) {
	    if (err)
	    {
	    	if ((completionHandler !== undefined) && (typeof(completionHandler) == "function"))
				completionHandler({success:false,errorCode:"Error while getting data from Neo4j"})
		}
		else
		{
		    if ((completionHandler !== undefined) && (typeof(completionHandler) == "function"))
				completionHandler({success:true,data:results})
		}
	});

}

exports.get_node = function (node,completionHandler) {

	graph.cypher({
	    //query: 'MATCH (el:Product) WHERE el.identifier = {identifier} RETURN el',
	    query: 'MATCH (el:Topic) WHERE el.id = {identifier} RETURN el',
	    params: {
	        identifier: node
	    }
	}, function (err, results) {
	    if (err)
	    {
	    	if ((completionHandler !== undefined) && (typeof(completionHandler) == "function"))
				completionHandler({success:false,errorCode:"Error while getting data from Neo4j"})
		}
		else
		{
		    if ((completionHandler !== undefined) && (typeof(completionHandler) == "function"))
				completionHandler({success:true,data:results})
		}
	});

}

exports.get_node_neighbors = function (node,_limit,_offset,completionHandler) {

	graph.cypher({
	    //query: 'MATCH (single:Product)-[:CORRELATO]-(product) WHERE single.identifier = {identifier} RETURN DISTINCT product SKIP {offset} LIMIT {limit}',
	    query: 'MATCH (single:Topic)-[rel]-(product) WHERE single.id = {identifier} RETURN DISTINCT product, rel.proximity AS proximity ORDER BY proximity DESC SKIP {offset} LIMIT {limit}' ,
	    params: {
	        identifier: node,
	        limit: _limit,
	        offset: _offset	        
	    }
	}, function (err, results) {
	    if (err)
	    {
	    	console.log(err)
	    	if ((completionHandler !== undefined) && (typeof(completionHandler) == "function"))
				completionHandler({success:false,errorCode:"Error while getting data from Neo4j"})
		}
		else
		{
		    if ((completionHandler !== undefined) && (typeof(completionHandler) == "function"))
		    {

		    	var _results = []
		    	for(var i=0;i<results.length;i++) {

		    		var _result = results[i]

		    		var _temp = {
		    			id:""
		    			name:""
		    			properties:""
		    		}

		    		_results.push(_temp)
		    	}

				completionHandler({success:true,data:_results})
			}
		}
	});

}