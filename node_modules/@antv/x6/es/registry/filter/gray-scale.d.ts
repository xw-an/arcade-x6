export interface GrayScaleArgs {
    /**
     * The proportion of the conversion.
     * A value of `1` is completely grayscale.
     * A value of `0` leaves the input unchanged.
     *
     * Default `1`.
     */
    amount?: number;
}
export declare function grayScale(args?: GrayScaleArgs): string;
