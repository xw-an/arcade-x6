import { Dictionary } from '../common';
import { JSONObject } from '../util';
import { Line, Rectangle, Ellipse, Polyline, Path, Segment } from '../geometry';
import { CellView } from './cell';
export declare class Cache {
    protected view: CellView;
    protected elemCache: Dictionary<Element, Cache.Item>;
    pathCache: {
        data?: string;
        length?: number;
        segmentSubdivisions?: Segment[][];
    };
    constructor(view: CellView);
    clean(): void;
    get(elem: Element): Cache.Item;
    getData(elem: Element): JSONObject;
    getMatrix(elem: Element): DOMMatrix;
    getShape(elem: Element): Polyline | Rectangle | Line | Path | Ellipse;
    getBoundingRect(elem: Element): Rectangle;
}
export declare namespace Cache {
    interface Item {
        data?: JSONObject;
        matrix?: DOMMatrix;
        boundingRect?: Rectangle;
        shape?: Rectangle | Ellipse | Polyline | Path | Line;
    }
}
