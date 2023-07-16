export interface OutlineArgs {
    /**
     * Outline color. Default `'blue'`.
     */
    color?: string;
    /**
     * Outline width. Default `1`
     */
    width?: number;
    /**
     * Gap between outline and the element. Default `2`
     */
    margin?: number;
    /**
     * Outline opacity. Default `1`
     */
    opacity?: number;
}
export declare function outline(args?: OutlineArgs): string;
