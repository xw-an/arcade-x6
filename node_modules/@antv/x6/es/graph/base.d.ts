import { Graph } from './graph';
import { Disposable } from '../common';
export declare class Base extends Disposable {
    readonly graph: Graph;
    get options(): import("./options").Options.Definition;
    get model(): import("..").Model;
    get view(): Graph.View;
    constructor(graph: Graph);
    protected init(): void;
}
export declare namespace Base { }
