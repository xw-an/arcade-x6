export declare namespace DataUri {
    function isDataUrl(url: string): boolean;
    /**
     * Converts an image at `url` to base64-encoded data uri.
     * The mime type of the image is inferred from the `url` file extension.
     */
    function imageToDataUri(url: string, callback: (err: Error | null, dataUri?: string) => any): void;
    function dataUriToBlob(dataUrl: string): Blob;
    function downloadBlob(blob: Blob, fileName: string): void;
    function downloadDataUri(dataUrl: string, fileName: string): void;
    function svgToDataUrl(svg: string, options?: {
        width?: number | null;
        height?: number | null;
    }): string;
}
