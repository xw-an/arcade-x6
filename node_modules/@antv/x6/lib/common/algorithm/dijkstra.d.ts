export declare namespace Dijkstra {
    type AdjacencyList = {
        [key: string]: string[];
    };
    type Weight = (u: string, v: string) => number;
    function run(adjacencyList: AdjacencyList, source: string, weight?: Weight): {
        [key: string]: string;
    };
}
