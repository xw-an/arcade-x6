export interface BrightnessArgs {
    /**
     * The proportion of the conversion.
     * A value of `1` leaves the input unchanged.
     * A value of `0` will create an image that is completely black.
     *
     * Default `1`.
     */
    amount?: number;
}
export declare function brightness(args?: BrightnessArgs): string;
