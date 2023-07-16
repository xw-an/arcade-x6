import { NodeView } from '@antv/x6';
import { VueShape } from './node';
export declare class VueShapeView extends NodeView<VueShape> {
    private vm;
    protected init(): void;
    getComponentContainer(): HTMLDivElement;
    confirmUpdate(flag: number): number;
    protected renderVueComponent(): void;
    protected unmountVueComponent(): HTMLDivElement;
    unmount(): this;
}
export declare namespace VueShapeView {
    const action: any;
}
