
    $(document).ready(function() {
      main()
    })

var start = {
 "id": "2680",
  "name": "Categoria 3",
 "properties": {"media": "gwj"},
 "nodes": [
  {
   "id": "1142",
   "distance": 19,
   "name": "categoria1",
   "properties": {"media": "9cds"}
  },
  {
   "id": "1139",
   "distance": 15,
   "name": "categoria2",
   "properties": {"media": "2p3f5"}
  }]
};

var counter = 0;
// Functions to traverse the graph
var getNodeChildren = function(graph, node_id, limit) {
  //var apiEndpoint = 'http://107.21.230.24/api/21/';
  var apiEndpoint = 'http://adgraph.herokuapp.com/api/v1/1/node/';
  //var param = '/neighbors/0.jgraph';
  var param = '/neighbors';
  counter++;
  var loadurl = apiEndpoint+node_id+param;
  console.log(loadurl);

  var parent = graph.getNode(node_id);

  console.log(node_id);

  $.ajax({
    url: loadurl,
    type: 'POST',
    data: {
      "limit": limit, // quanti ne voglio
      "offset":0 // da dove voglio
    },
    dataType: 'json',
    jsonpCallback: 'json',
    success: function(data) { 
      var children = data.data;

      console.log('data getNodeChildren', data.data);
      
      for (var i = 0; i < children.length; ++i){

          graph.addNode(children[i].properties.identifier,{description:children[i].properties.description,thumbnail:children[i].properties.thumbnail,name: children[i].properties.name})
          graph.addLink(node_id, children[i].properties.identifier, 80)
         
      };
    }

  })
};


// function to decorate with wikipedia
// TODO use a callback to populate cluster of nodes, not one by one

// Gamify: show the tap-path 
// TODO : show the tree instead ? tap-path is simpler
// TODO: use array or object ?

var pushTapPath = function(node) {
    // TODO : POST RESULT TO NEO AT THE END OF THE SESSION
    tapPath.push(node);
}

var tapPath = 0

        function main () {

            // Step 1. We create a graph object.
            var graph = Viva.Graph.graph();

            // initialize TODO replace with query
            var data = start;

            graph.addNode(data.id, {name: data.name});

            var children = data.nodes;
            for (var i = 0; i < children.length; ++i){
                graph.addNode(children[i].id, {description:children[i].description,thumbnail:children[i].thumbnail,name: children[i].name});
                graph.addLink(data.id, children[i].id, children[i].distance);
            }

            var graphics = Viva.Graph.View.svgGraphics(),
                nodeSize = 80;

            // Step 2. Add UI and UX to nodes
            graphics.node(function (node) {

                // UI
                var nameTopic = node.data.name;
                console.log(node)

                var ui = Viva.Graph.svg('g'),

                    svgText = Viva.Graph.svg('text')
                        .attr('text-anchor','middle')
                        .attr('y', 1.2*nodeSize).text(nameTopic)
                        .attr('x', 0).text(nameTopic),

                    img = Viva.Graph.svg('image')
                     .attr('width', nodeSize)
                     .attr('height', nodeSize)
                     .attr('x', -nodeSize/2)
                     .attr('y', 0)
                     .link(node.data.thumbnail||"http://adgraph.herokuapp.com/images/logo.png");
                     // https://secure.gravatar.com/avatar/d43e8ea63b61e7669ded5b9d3c2e980f

                ui.append(svgText);
                ui.append(img);

                var limit = 0;



                ui.addEventListener('dblclick', function() {
                  var description = node.data.description;

                  vex.dialog.alert({
                    message:description,
                    afterOpen:function(vexContent) {
                      setTimeout(function() {
                        $(vexContent).addClass("expandWidth");  
                      },100)
                      setTimeout(function() {
                        $(".vex-dialog-message").addClass("showControl")
                        $(".vex-dialog-buttons").addClass("showControl")
                      },400)
                    },
                    buttons:[$.extend({}, vex.dialog.buttons.YES, {text:"Chiudi"})]
                  });

                  var pos = layout.getNodePosition(node.id);
                  renderer.moveTo(pos.x, pos.y);

                  // if ($(".viva-graph-detail-pane").hasClass("hide-details"))
                  //   $(".viva-graph-detail-pane").removeClass("hide-details")
                  // else
                  //   $(".viva-graph-detail-pane").addClass("hide-details")

                  // $(".full-content").html(node.data.description)
                })

                ui.addEventListener('click', function () {
                    console.log(node.id);

                    if (window.visitedNode===undefined) 
                      window.visitedNode = []

                    if (window.visitedNode.indexOf(node.id)>=0) 
                      return;

                    window.visitedNode.push(node.id)

                    getNodeChildren(graph, node.id, 2);                  
                });
                return ui;
            }).placeNode(function(nodeUI, pos) {
                nodeUI.attr('transform','translate('+(pos.x) + ',' + (pos.y - nodeSize/2) +')');
            });

            // Step 3. Add UI to links
            graphics.link(function (link) {

                var thickNess = 10;
                thickNess *= thickNess/20000;
                return Viva.Graph.svg('line').attr('stroke', '#000').attr('stroke-width', thickNess)
            });


            // Step 4. Render the graph.
            var idealLength = 60;


            var layout = Viva.Graph.Layout.forceDirected(graph, {
               springLength : idealLength,
               springCoeff : 0.0005,
               dragCoeff : 0.1,
               gravity : -1000,
               theta: 0,
               springTransform: function (link, spring) {
                    //console.log('d',link.data);
                    spring.length = 1/(1000-link.data);
                    //spring.length = 1;
                    //console.log('this is in spring',link.data);
                    //console.log('spring',spring.length);
                  },
                timeStep : 9,
                stableThreshold: 0.01
            });

            var renderer = Viva.Graph.View.renderer(graph, {
                layout    : layout,
                graphics  : graphics,
                container : document.getElementById('graphContainer')
            });
        
           renderer.run();

        }

        $(document).on("click",".close-button",function() {
          $(".viva-graph-detail-pane").addClass("hide-details")
          $(".viva-graph-detail-pane > .full-content").children().remove()
          return false;
        })