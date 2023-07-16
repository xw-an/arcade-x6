import { Graph } from './graph';
export declare namespace Decorator {
    function checkScroller(err?: boolean, warning?: boolean): (target: Graph, methodName: string, descriptor: PropertyDescriptor) => void;
}
