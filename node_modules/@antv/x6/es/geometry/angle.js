export var Angle;
(function (Angle) {
    /**
     * Converts radian angle to degree angle.
     * @param rad The radians to convert.
     */
    function toDeg(rad) {
        return ((180 * rad) / Math.PI) % 360;
    }
    Angle.toDeg = toDeg;
    /**
     * Converts degree angle to radian angle.
     * @param deg The degree angle to convert.
     * @param over360
     */
    Angle.toRad = function (deg, over360 = false) {
        const d = over360 ? deg : deg % 360;
        return (d * Math.PI) / 180;
    };
    /**
     * Returns the angle in degrees and clamps its value between `0` and `360`.
     */
    function normalize(angle) {
        return (angle % 360) + (angle < 0 ? 360 : 0);
    }
    Angle.normalize = normalize;
})(Angle || (Angle = {}));
//# sourceMappingURL=angle.js.map