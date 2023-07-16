/**
 * Converts provided SVG path data string into a normalized path data string.
 *
 * The normalization uses a restricted subset of path commands; all segments
 * are translated into lineto, curveto, moveto, and closepath segments.
 *
 * Relative path commands are changed into their absolute counterparts,
 * and chaining of coordinates is disallowed.
 *
 * The function will always return a valid path data string; if an input
 * string cannot be normalized, 'M 0 0' is returned.
 */
export declare function normalizePathData(pathData: string): string;
