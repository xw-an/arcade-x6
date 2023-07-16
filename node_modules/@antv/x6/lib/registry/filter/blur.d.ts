export interface BlurArgs {
    /**
     * Horizontal blur. Default `2`
     */
    x?: number;
    /**
     * Vertical blur.
     */
    y?: number;
}
export declare function blur(args?: BlurArgs): string;
