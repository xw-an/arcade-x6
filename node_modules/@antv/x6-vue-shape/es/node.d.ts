import { Node } from '@antv/x6';
import { Definition } from './registry';
export declare class VueShape<Properties extends VueShape.Properties = VueShape.Properties> extends Node<Properties> {
    get component(): VueShape.Properties['component'];
    set component(val: VueShape.Properties['component']);
    getComponent(): VueShape.Properties['component'];
    setComponent(component: VueShape.Properties['component'], options?: Node.SetOptions): this;
    removeComponent(options?: Node.SetOptions): this;
}
export declare namespace VueShape {
    type Primer = 'rect' | 'circle' | 'path' | 'ellipse' | 'polygon' | 'polyline';
    interface Properties extends Node.Properties {
        primer?: Primer;
        useForeignObject?: boolean;
        component?: Definition | string;
    }
}
export declare namespace VueShape {
}
