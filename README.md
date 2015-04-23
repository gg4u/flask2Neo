# flask2Neo
Mockup for Python flask middleware in flask.
CORS enabled, to start server :

python flaskNeo.py

API REST served on /localhost:5000

index.html is just a prototype and experiment.





Con i seguenti comandi installiamo elasticsearch con brew
Successivamente saremo in grado così di interrogarlo digitando: elasticsearch 
e premendo Enter nella nostra Keyboard

cd /usr/local/Library
git checkout 3bbd4f1 /usr/local/Library/Formula/elasticsearch.rb
brew install elasticsearch

Dopo aver correttamente installato Elasticsearch


Effettuando una chiamata PUT all'url indicato River inizierà ad indicizzare 
i contenuti del nostro Neo4j all'interno dell'elasticsearch, per poi permettere 
la full text search

url: http://localhost:9200/_river/x_discovery/_meta
body:
{
    "type": "neo4j",
    "neo4j": {
        "uri": "http://localhost:7474/db/data",
        "interval": 10,
        "labels" : [
        	"Topic"
        ]
    },
    "index": {
        "name": "discovery",
        "type": "string"
    }
}

Successivamente facendo una GET al seguente link siamo in grado di vedere
il nostro indice creato con successo

url: http://localhost:9200/_river/x_discovery/_meta