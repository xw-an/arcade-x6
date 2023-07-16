import { Point } from '../geometry';
import { Events } from '../common';
import { KeyValue } from '../types';
import { Cell } from '../model/cell';
import { Node } from '../model/node';
import { Edge } from '../model/edge';
import { Model } from '../model/model';
export declare class ForceDirected extends Events {
    t: number;
    energy: number;
    progress: number;
    readonly options: ForceDirected.Options;
    protected edges: Edge[];
    protected nodes: Node[];
    protected nodeData: KeyValue<ForceDirected.NodeData>;
    protected edgeData: KeyValue<ForceDirected.EdgeData>;
    get model(): Model;
    constructor(options: ForceDirected.Options);
    start(): void;
    step(): void;
    protected cool(t: number, energy: number, energyBefore: number): number;
    protected notifyEnd(): void;
}
export declare namespace ForceDirected {
    interface Options {
        model: Model;
        x: number;
        y: number;
        width: number;
        height: number;
        charge?: number;
        edgeDistance?: number;
        edgeStrength?: number;
        gravityCenter?: Point.PointLike;
    }
    interface NodeData {
        x: number;
        y: number;
        px: number;
        py: number;
        fx: number;
        fy: number;
        charge: number;
        weight: number;
    }
    interface EdgeData {
        source: Cell;
        target: Cell;
        strength: number;
        distance: number;
    }
}
