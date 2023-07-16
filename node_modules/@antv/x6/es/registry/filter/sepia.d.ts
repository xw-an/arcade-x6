export interface SepiaArgs {
    /**
     * The proportion of the conversion.
     * A value of `1` is completely sepia.
     * A value of `0` leaves the input unchanged.
     *
     * Default `1`.
     */
    amount?: number;
}
export declare function sepia(args?: SepiaArgs): string;
