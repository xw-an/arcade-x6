import { Node } from '../../model/node';
import { Cell } from '../../model/cell';
import { Base } from '../base';
export declare function getMarkup(tagName: string, noText?: boolean): string;
export declare function getName(name: string): string;
export declare function getImageUrlHook(attrName?: string): Cell.PropHook<Cell.Metadata, Cell<Cell.Properties>>;
export declare function createShape(shape: string, config: Node.Config, options?: {
    noText?: boolean;
    ignoreMarkup?: boolean;
    parent?: Node.Definition | typeof Base;
}): typeof Base;
