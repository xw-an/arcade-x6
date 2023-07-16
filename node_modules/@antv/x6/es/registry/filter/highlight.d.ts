export interface HighlightArgs {
    /**
     * Highlight color. Default `'red'`.
     */
    color?: string;
    /**
     * Highlight blur. Default `0`.
     */
    blur?: number;
    /**
     * Highlight width. Default `1`.
     */
    width?: number;
    /**
     * Highlight opacity. Default `1`.
     */
    opacity?: number;
}
export declare function highlight(args?: HighlightArgs): string;
