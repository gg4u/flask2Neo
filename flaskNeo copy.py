from flask import Flask, Response, json, jsonify, request, Blueprint, render_template
from neo4jrestclient.client import GraphDatabase
from urlparse import urlparse
import re
from flask.ext.cors import CORS



app = Flask(__name__)
cors = CORS(app)
CORS(app, resources=r'/api/*', headers='Content-Type')


@app.route('/_api/hydraGraph')

def api_response():
	# Callback
	callbackArguments = request.args['callback']
	# Create Db connection
	db = GraphDatabase("http://localhost:7474/db/data")
	# HOW TO ??
	node = getNode(db,'Mynode')
	path = getPaths(db,'Mynode1','Mynode2')
	result = {
		'nodes' : node
		'path' : path
	}
	# GET Request Response
	callbackWrapper = callbackArguments + "(" + result + ")"
	resp = Response(callbackWrapper, status = 200, mimetype = 'application/json') 
	return resp 


def createNodeJSON(uid, sourceId, name, description):	
	JSONObject = {
		'name': '',
		'uid' : '',
		'sourceId' : '',
		'description' : ''
	}
	return JSONObject

def doRegEX(urlString):
	regex = re.compile("([^/]*)$")
	stripedURLComponent = regex.search(urlString.path)
	return stripedURLComponent.group(0)

def getNode(db,keyword):
	q = "MATCH (n) WHERE n.name = '"+keyword+"' Return n"
	params = {}
	querySquenceObject = db.query(q, params=params)	
	#Blank list to hold the JSON
	nodeJSON = []
	# Iterating over the resposes from the graph db
	# NOTE:Excluding the ROOT NODE from RETURN!!!!
	for node in querySquenceObject[0:]:
		n = node.pop()
		data = n.get('data')
		name = data.get('name')
		name = name.encode('utf8')	
		sourceId = data.get('id')
		#sourceId = str(sourceId)
		#sourceId = sourceId.encode('utf8')	
		description = data.get('description')
		self = n.get('self')
		print self
		self = urlparse(self)
		uid = doRegEX(self)
		#uid = str(uid)
		#uid = uid.encode('utf8')	
		if (sourceId):
			nodeJSON.append(createNodeJSON(name, uid, sourceId, description))
		else:
			print 'node uid', uid ,' is missing sourceId', 
	return nodeJSON



def getPaths(db,startNode, endNode):
	## TODO: improve here casue you get multiples queries for each query of a path
	q = """
	MATCH (n {name : """+startNode+"""}) , (m {name : """+endNode+"""}),
	p = allShortestPaths((n)-[*..2]-(m))
	with p, n, m
	return p, reduce(totProximity = 0, n IN relationships(p)| totProximity + n.proximity) AS pathProximity order by pathProximity DESC
	"""
	params = {}
	querySequenceObject = db.query(q, params=params)
	#Blank list to hold the JSON
	path = []
	for obj in querySequenceObject:
		pathJSON = []
		pathWeight = obj.pop()
		p = obj.pop()
		plist = p.get('nodes')
		#
		for n in plist:
			uid = doRegEX(urlparse(n))
			#uid = str(uid)
			#uid = uid.encode('utf8')
			sourceId = db.node.get(uid)['id']
			#sourceId = str(sourceId)
			#sourceId = sourceId.encode('utf8')	
			name = db.node.get(uid)['name']
			#name = name.encode('utf8')	
			path.append([uid,sourceId,name])
		# delete duplicates > TODO in Cypher
		#
		'''
		TODO: get proximity of connecting relationships
		rel = o.get('relationships')
		for r in rel:
			relUid = doRegEX(urlparse(r))
			proximity = db.relationships.get(relUid)['proximity']
		'''
	for i in path:
		pathJSON.append(createNodeJSON(i[0],i[1],i[2],''))
	#
	return pathJSON


if __name__ == '__main__':
	app.debug = True
	app.run()
