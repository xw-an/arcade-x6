import { Markup } from '../../view/markup';
import { Node } from '../../model/node';
import { Base } from '../base';
export declare function getMarkup(tagName: string, selector?: string): Markup;
export declare function createShape(shape: string, config: Node.Config, options?: {
    selector?: string;
    parent?: Node.Definition | typeof Base;
}): typeof Base;
