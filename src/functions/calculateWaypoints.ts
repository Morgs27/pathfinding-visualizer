import Point from "../types/Point";

function calcWaypoints(vertices: Point[]) {
  var waypoints = [];
  var totalDistance = 0;

  // Calculate total distance
  for (var i = 1; i < vertices.length; i++) {
    var dx = vertices[i].x - vertices[i - 1].x;
    var dy = vertices[i].y - vertices[i - 1].y;
    totalDistance += Math.sqrt(dx * dx + dy * dy);
  }

  // Calculate waypoints proportional to distance
  for (var i = 1; i < vertices.length; i++) {
    var pt0 = vertices[i - 1];
    var pt1 = vertices[i];
    var dx = pt1.x - pt0.x;
    var dy = pt1.y - pt0.y;
    var segmentDistance = Math.sqrt(dx * dx + dy * dy);
    var numWaypoints = Math.floor((segmentDistance / totalDistance) * 1000); // Adjust 1000 as needed

    for (var j = 0; j < numWaypoints; j++) {
      var x = pt0.x + (dx * j) / numWaypoints;
      var y = pt0.y + (dy * j) / numWaypoints;
      waypoints.push({ x: x, y: y });
    }
  }

  return waypoints;
}

export default calcWaypoints;
