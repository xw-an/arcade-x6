export interface HueRotateArgs {
    /**
     * The number of degrees around the color.
     *
     * Default `0`.
     */
    angle?: number;
}
export declare function hueRotate(args?: HueRotateArgs): string;
