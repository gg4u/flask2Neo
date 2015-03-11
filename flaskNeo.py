from flask import Flask, Response, json, jsonify, request, Blueprint, render_template
from neo4jrestclient.client import GraphDatabase
from urlparse import urlparse
import re

import nltk
from collections import defaultdict

from flask.ext.cors import CORS
from flask.ext.cors import cross_origin




app = Flask(__name__)
#cors = CORS(app)
CORS(app, resources=r'/api/*', headers='Origin, X-Requested-With, Content-Type, Accept')
#cors = CORS(app, resources={r"/api/*": {"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"}})
#cross_origin(headers=['Content-Type'])

@app.route('/api/')
#@app.route('/')
@app.route('/api/learn/nodeList/<keyword>')
@app.route('/api/learn/node/<keyword>', methods=['GET', 'POST'])
@app.route('/api/learn/neighbors/<keyword>')
@app.route('/api/learn/path/<keyword>')
@app.route('/api/23/<sourceId>/neighbors/<direction>.jgraph')





def api_response(keyword):
	# Callback
	#callbackArguments = request.args['callback']
	# Create Db connection
	db = GraphDatabase("http://localhost:7474/db/data")
	#node = getNodeFromList(db,keyword)
	node = getNode(db,keyword)
	#path = getPaths(db,'Cocaine','Stroke')
	result = {
		'nodes' : node
		#'path' : path
	}
	# GET Request Response
	#callbackWrapper = callbackArguments + "(" + jsonify(result) + ")"
	#resp = Response(callbackWrapper, status = 200, mimetype = 'application/json') 
	#return resp 
	return jsonify(result)




def getNeighbors(db,keyword):
	q = "MATCH (n) WHERE n.name =~'(?i).*%s*.' Return n" % keyword
	params = {}
	querySquenceObject = db.query(q, params=params)	
	x = getSearchList(querySquenceObject)
	q = "MATCH (n) WHERE n.name =~'(?i).*%s*.' Return n" % keyword	
	#Blank list to hold the JSON
	nodeJSON = []
	# Iterating over the resposes from the graph db
	# NOTE:Excluding the ROOT NODE from RETURN!!!!
	for node in querySquenceObject[0:]:
		n = node.pop()
		data = n.get('data')
		name = data.get('name')
		#name = name.encode('utf8')	
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
			nodeJSON.append(createNodeJSON(uid, sourceId, name, 'description'))
		else:
			print 'node uid', uid ,' is missing sourceId', 
	return nodeJSON



def createNodeJSON(uid, sourceId, name, description):	
	JSONObject = {
		'name': name,
		'uid' : uid,
		'sourceId' : sourceId,
		'description' : description
	}
	return JSONObject

def doRegEX(urlString):
	regex = re.compile("([^/]*)$")
	stripedURLComponent = regex.search(urlString.path)
	return stripedURLComponent.group(0)


def getNode(db,keyword):
	q = "MATCH (n) WHERE n.name =~'(?i).*%s*.' Return n" % keyword
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
		#name = name.encode('utf8')	
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
			nodeJSON.append(createNodeJSON(uid, sourceId, name, 'description'))
		else:
			print 'node uid', uid ,' is missing sourceId', 
	return nodeJSON


def getSearchList(query):
	exactMatchJ = None
	secondMatchJ = []
	otherMatchJ = []
	sortedNodeJSON = []
	# Iterating over the resposes from the graph db
	# NOTE:Excluding the ROOT NODE from RETURN!!!!
	for node in querySequenceObject[:]:
		n = node.pop()
		data = n.get('data')
		name = data.get('name')
		#name = name.encode('utf8')	
		sourceId = data.get('id')
		#sourceId = str(sourceId)
		#sourceId = sourceId.encode('utf8')	
		description = data.get('description')
		self = n.get('self')
		#print self
		self = urlparse(self)
		uid = doRegEX(self)
		#uid = str(uid)
		#uid = uid.encode('utf8')
		rawJ = (uid, sourceId, name, 'description')
		if (sourceId) & (name.lower() == keyword.lower()):
			exactMatchJ = (uid, sourceId, name, 'description')
			#print exactMatchJ
		elif (sourceId):
			if keyword.lower() in name.lower().split(' '):
				secondMatchJ.append(rawJ)
				#print secondMatchJ
			else:
				otherMatchJ.append(rawJ)
				#print otherMatchJ
		else:
			print 'node uid', uid ,' is missing sourceId' 
	# sort list by len(string)
	srtSecondMatchJ = sorted(secondMatchJ,key=lambda x: len(x[2]))
	srtOtherMatchJ = sorted(otherMatchJ,key=lambda x: nltk.metrics.edit_distance(keyword, x[2]))
	sortedNodeJSON = srtSecondMatchJ + srtOtherMatchJ 
	# If exact match of topic is found, put it first !
	#contacts = [(name, ip) for name, ip in contacts if ip != keyword]
	if (exactMatchJ != None):
		sortedNodeJSON.insert(0,exactMatchJ)
	return sortedNodeJSON



def getNodeFromList(db,keyword):
	q = "MATCH (n) WHERE n.name =~'(?i).*%s*.' Return n" % keyword
	params = {}
	querySequenceObject = db.query(q, params=params)	
	#Blank list to hold the JSON
	results = getSearchList(querySequenceObject)
	nodeJSON = []
	for record in results:
		print record
		nodeJSON.append(createNodeJSON(record[0],record[1],record[2],record[3]))
	return nodeJSON


def getPaths(db,startNode, endNode):
	## TODO: improve here casue you get multiples queries for each query of a path
	q = """
	MATCH (n {name : "European Central Bank"'}) , (m {name : "Financial Crisis"}),
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

def __unicode__(self):
    return unicode(self.created)


if __name__ == '__main__':
	app.debug = True
	app.run()

'''

q = "START n=node(*) MATCH (n)-[r]->() RETURN r"



getNode(db,'Camorra')
getPaths(db,'Cocaine','Stroke')

q = """
	MATCH (n {name : "Cocaine"}) , (m {name : "Stroke"}),
	p = allShortestPaths((n)-[*..2]-(m))
	with p, n, m
	return p, reduce(totProximity = 0, n IN relationships(p)| totProximity + n.proximity) AS pathProximity order by pathProximity DESC LIMIT 25
	"""

returns=(client.Node, unicode, client.Relationship)

querySequenceObject = db.query(q, params=params)

querySequenceObject


'''