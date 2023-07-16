import { Edge } from '../../model/edge';
import { Halo } from './index';
export declare class EdgePreset {
    private halo;
    constructor(halo: Halo);
    get options(): Halo.Options;
    get graph(): import("../..").Graph;
    get model(): import("../..").Model;
    get view(): import("../..").CellView<import("../..").Cell<import("../..").Cell.Properties>, import("../..").CellView.Options>;
    get cell(): import("../..").Cell<import("../..").Cell.Properties>;
    get edge(): Edge<Edge.Properties>;
    getPresets(): Halo.Options;
    removeEdge(): void;
    directionSwap(): void;
}
