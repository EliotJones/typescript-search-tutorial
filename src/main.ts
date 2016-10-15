function run() {
  var graph = new CoreGraph(["0",
    "A", "B", "C", "D", "E", "F"]);

  graph.setEnd("F");
  graph.setStart("0");

  graph.linkNodes("0", "A", 3);
  graph.linkNodes("0", "B", 5);
  graph.linkNodes("A", "B", 4);
  graph.linkNodes("A", "D", 3);
  graph.linkNodes("D", "F", 5);
  graph.linkNodes("B", "C", 4);
  graph.linkNodes("C", "E", 6);

  draw(graph);

  var path = graph.calculatePath(true);

  $("body").append(`<div class=\"path\"><span class=\"label\">Result:</span> ${path[0].toString()}</div>`)
}

function draw(graph: CoreGraph) {
  var edges = graph.Edges;

  $("body").append("<div id=\"container\"></div>");

  var drawn = [];

  var location = { x: 0, y: 0 };
  var goRight = false;


  for (var i = 0; i < edges.length; i++){
    var hasDrawn = drawn.filter(x => x == edges[i].origin.id).length > 0;

    if (!hasDrawn){
      $("#container").append(getNodeDiv(location, edges[i].origin));

      drawn.push(edges[i].origin.id);

      if (goRight){
        location.x += 50;
        goRight = false;
      } else {
        location.y += 50;
        goRight = true;
      }
    }

    hasDrawn = drawn.filter(x => x == edges[i].destination.id).length > 0;
    
    if (!hasDrawn){
      $("#container").append(getNodeDiv(location, edges[i].destination));

      drawn.push(edges[i].destination.id);

      if (goRight){
        location.x += 50;
        goRight = false;
      } else {
        location.y += 50;
        goRight = true;
      }
    }
  }

  $("#container").height(location.y + 50);
}

function getNodeDiv(location : any, node : GraphNode){
  var cssClass = node.isStart ? "start" : node.isEnd ? "end" : "";

  return `<div class=\"${cssClass}\" style=\" position: absolute; left:${location.x}px; top:${location.y}px\">`
  + node.id + "</div>";
}

$(function () {
  console.log("running");
  run();
});