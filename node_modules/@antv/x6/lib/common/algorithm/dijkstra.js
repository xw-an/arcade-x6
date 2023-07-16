"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dijkstra = void 0;
var priorityqueue_1 = require("./priorityqueue");
var Dijkstra;
(function (Dijkstra) {
    function run(adjacencyList, source, weight) {
        if (weight === void 0) { weight = function (u, v) { return 1; }; }
        var dist = {};
        var previous = {};
        var scanned = {};
        var queue = new priorityqueue_1.PriorityQueue();
        dist[source] = 0;
        Object.keys(adjacencyList).forEach(function (v) {
            if (v !== source) {
                dist[v] = Infinity;
            }
            queue.insert(dist[v], v, v);
        });
        while (!queue.isEmpty()) {
            var u = queue.remove();
            scanned[u] = true;
            var neighbours = adjacencyList[u] || [];
            for (var i = 0; i < neighbours.length; i += 1) {
                var v = neighbours[i];
                if (!scanned[v]) {
                    var alt = dist[u] + weight(u, v);
                    if (alt < dist[v]) {
                        dist[v] = alt;
                        previous[v] = u;
                        queue.updatePriority(v, alt);
                    }
                }
            }
        }
        return previous;
    }
    Dijkstra.run = run;
})(Dijkstra = exports.Dijkstra || (exports.Dijkstra = {}));
//# sourceMappingURL=dijkstra.js.map