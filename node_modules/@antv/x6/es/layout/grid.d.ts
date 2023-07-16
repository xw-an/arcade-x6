import { Node } from '../model/node';
import { Model } from '../model/model';
export declare function grid(cells: Node[] | Model, options?: GridLayout.Options): void;
declare namespace GridLayout {
    interface Options extends Node.SetPositionOptions {
        columns?: number;
        columnWidth?: number | 'auto' | 'compact';
        rowHeight?: number | 'auto' | 'compact';
        dx?: number;
        dy?: number;
        marginX?: number;
        marginY?: number;
        /**
         * Positions the elements in the center of a grid cell.
         *
         * Default: true
         */
        center?: boolean;
        /**
         * Resizes the elements to fit a grid cell, preserving the aspect ratio.
         *
         * Default: false
         */
        resizeToFit?: boolean;
    }
    function getMaxDim(nodes: Node[], name: 'width' | 'height'): number;
    function getNodesInRow(nodes: Node[], rowIndex: number, columnCount: number): Node<Node.Properties>[];
    function getNodesInColumn(nodes: Node[], columnIndex: number, columnCount: number): Node<Node.Properties>[];
    function accumulate(items: number[], start: number): number[];
}
export {};
