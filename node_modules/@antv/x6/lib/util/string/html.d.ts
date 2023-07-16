/// <reference types="jquery" />
/**
 * Sanitizes HTML with jQuery prevent Application from XSS attacks.
 * ref: https://gist.github.com/ufologist/5a0da51b2b9ef1b861c30254172ac3c9
 */
export declare function sanitizeHTML(html: string): string;
export declare function sanitizeHTML(html: string, options: {
    raw: false;
}): string;
export declare function sanitizeHTML(html: string, options: {
    raw: true;
}): JQuery.Node[];
