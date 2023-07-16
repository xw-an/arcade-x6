import { Grid } from './index';
export interface DoubleMeshOptions extends Grid.Options {
    factor?: number;
}
export declare const doubleMesh: Grid.Definition<DoubleMeshOptions>[];
