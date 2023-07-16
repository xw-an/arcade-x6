export interface SaturateArgs {
    /**
     * The proportion of the conversion.
     * A value of `1` is completely un-saturated.
     * A value of `0` leaves the input unchanged.
     *
     * Default `1`.
     */
    amount?: number;
}
export declare function saturate(args?: SaturateArgs): string;
