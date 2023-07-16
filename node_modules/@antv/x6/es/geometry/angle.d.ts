export declare namespace Angle {
    /**
     * Converts radian angle to degree angle.
     * @param rad The radians to convert.
     */
    function toDeg(rad: number): number;
    /**
     * Converts degree angle to radian angle.
     * @param deg The degree angle to convert.
     * @param over360
     */
    const toRad: (deg: number, over360?: boolean) => number;
    /**
     * Returns the angle in degrees and clamps its value between `0` and `360`.
     */
    function normalize(angle: number): number;
}
