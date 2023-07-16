export declare const KAPPA = 0.551784;
export declare function sample(elem: SVGPathElement, interval?: number): {
    distance: number;
    x: number;
    y: number;
}[];
export declare function lineToPathData(line: SVGLineElement): string;
export declare function polygonToPathData(polygon: SVGPolygonElement): string | null;
export declare function polylineToPathData(polyline: SVGPolylineElement): string | null;
export declare function getPointsFromSvgElement(elem: SVGPolygonElement | SVGPolylineElement): DOMPoint[];
export declare function circleToPathData(circle: SVGCircleElement): string;
export declare function ellipseToPathData(ellipse: SVGEllipseElement): string;
export declare function rectangleToPathData(rect: SVGRectElement): string;
export declare function rectToPathData(r: {
    x: number;
    y: number;
    width: number;
    height: number;
    rx?: number;
    ry?: number;
    'top-rx'?: number;
    'bottom-rx'?: number;
    'top-ry'?: number;
    'bottom-ry'?: number;
}): string;
export declare function toPath(elem: SVGLineElement | SVGPolygonElement | SVGPolylineElement | SVGEllipseElement | SVGCircleElement | SVGRectElement): SVGPathElement;
export declare function toPathData(elem: SVGLineElement | SVGPolygonElement | SVGPolylineElement | SVGEllipseElement | SVGCircleElement | SVGRectElement): string | null;
export declare function createSlicePathData(innerRadius: number, outerRadius: number, startAngle: number, endAngle: number): string;
