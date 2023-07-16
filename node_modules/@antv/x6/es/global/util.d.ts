import { KeyValue } from '../types';
import { snapToGrid as snap } from '../geometry/util';
import { normalize } from '../registry/marker/util';
import { Cell } from '../model/cell';
import { Node } from '../model/node';
import { Edge } from '../model/edge';
export declare namespace Util {
    const snapToGrid: typeof snap;
    const normalizeMarker: typeof normalize;
    function prefix(suffix: string): string;
}
export declare namespace Util {
    interface TreeItem extends KeyValue {
        name: string;
    }
    interface MakeTreeOptions {
        children?: string | ((parent: TreeItem) => TreeItem[]);
        createNode: (metadata: TreeItem) => Node;
        createEdge: (parent: Node, child: Node) => Edge;
    }
    function makeTree(parent: TreeItem, options: MakeTreeOptions, parentNode: Node, collector?: Cell[]): Cell<Cell.Properties>[];
}
