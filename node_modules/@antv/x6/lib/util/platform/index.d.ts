export declare namespace Platform {
    const IS_MAC: boolean;
    const IS_IOS: boolean;
    const IS_WINDOWS: boolean;
    const IS_IE: boolean;
    const IS_IE11: boolean;
    const IS_EDGE: boolean;
    /**
     * A flag indicating whether the browser is Netscape (including Firefox).
     */
    const IS_NETSCAPE: boolean;
    /**
     * A flag indicating whether the the this is running inside a Chrome App.
     */
    const IS_CHROME_APP: boolean;
    const IS_CHROME: boolean;
    const IS_OPERA: boolean;
    const IS_FIREFOX: boolean;
    const IS_SAFARI: boolean;
    /**
     * A flag indicating whether this device supports touchstart/-move/-end
     * events (Apple iOS, Android, Chromebook and Chrome Browser on touch-enabled
     * devices).
     */
    const SUPPORT_TOUCH: boolean;
    /**
     * A flag indicating whether this device supports Microsoft pointer events.
     */
    const SUPPORT_POINTER: boolean;
    const SUPPORT_PASSIVE: boolean;
    /**
     * A flag indicating whether foreignObject support is not available. This
     * is the case for Opera, older SVG-based browsers and all versions of IE.
     */
    const NO_FOREIGNOBJECT: boolean;
    const SUPPORT_FOREIGNOBJECT: boolean;
}
export declare namespace Platform {
    function getHMRStatus(): any;
    function isApplyingHMR(): boolean;
    function isEventSupported(event: string): boolean;
}
