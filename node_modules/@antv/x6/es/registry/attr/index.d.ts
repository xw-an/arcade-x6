import { Rectangle, Point } from '../../geometry';
import { JSONObject } from '../../util';
import { Cell } from '../../model';
import { CellView } from '../../view';
import { Registry } from '../registry';
export declare namespace Attr {
    type SimpleAttrValue = null | undefined | string | number;
    type SimpleAttrs = {
        [name: string]: SimpleAttrValue;
    };
    type ComplexAttrValue = null | undefined | boolean | string | number | JSONObject;
    type ComplexAttrs = {
        [name: string]: ComplexAttrValue;
    };
    type CellAttrs = {
        [selector: string]: ComplexAttrs;
    };
}
export declare namespace Attr {
    interface QualifyOptions {
        elem: Element;
        attrs: ComplexAttrs;
        cell: Cell;
        view: CellView;
    }
    type QualifyFucntion = (this: CellView, val: ComplexAttrValue, options: QualifyOptions) => boolean;
    interface Options extends QualifyOptions {
        refBBox: Rectangle;
    }
    type SetFunction = (this: CellView, val: ComplexAttrValue, options: Options) => SimpleAttrValue | SimpleAttrs | void;
    type OffsetFunction = (this: CellView, val: ComplexAttrValue, options: Options) => Point.PointLike;
    type PositionFunction = (this: CellView, val: ComplexAttrValue, options: Options) => Point.PointLike | undefined | null;
    interface Qualify {
        qualify?: QualifyFucntion;
    }
    interface SetDefinition extends Qualify {
        set: SetFunction;
    }
    interface OffsetDefinition extends Qualify {
        offset: OffsetFunction;
    }
    interface PositionDefinition extends Qualify {
        /**
         * Returns a point from the reference bounding box.
         */
        position: PositionFunction;
    }
    type Definition = string | Qualify | SetDefinition | OffsetDefinition | PositionDefinition;
    type Definitions = {
        [attrName: string]: Definition;
    };
    type GetDefinition = (name: string) => Definition | null | undefined;
}
export declare namespace Attr {
    function isValidDefinition(this: CellView, def: Definition | undefined | null, val: ComplexAttrValue, options: QualifyOptions): def is Definition;
}
export declare namespace Attr {
    type Presets = typeof Attr['presets'];
    type NativeNames = keyof Presets;
}
export declare namespace Attr {
    const presets: Definitions;
    const registry: Registry<Definition, Definitions, never>;
}
