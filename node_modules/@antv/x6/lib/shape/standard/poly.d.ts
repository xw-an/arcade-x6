import { Base } from '../base';
import { Point } from '../../geometry';
import { Node } from '../../model/node';
export declare class Poly extends Base {
    get points(): string | undefined | null;
    set points(pts: string | undefined | null);
    getPoints(): string;
    setPoints(points?: string | Point.PointLike[] | Point.PointData[] | null, options?: Node.SetOptions): this;
    removePoints(): this;
}
export declare namespace Poly {
    function pointsToString(points: Point.PointLike[] | Point.PointData[] | string): string;
}
