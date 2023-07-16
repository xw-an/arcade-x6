import { Registry } from '../../registry';
import { Node } from '../../model/node';
import { NodeView } from '../../view/node';
import { Graph } from '../../graph/graph';
import { Base } from '../base';
export declare class HTML<Properties extends HTML.Properties = HTML.Properties> extends Base<Properties> {
    get html(): HTML.Component | HTML.UpdatableComponent | null | undefined;
    set html(val: HTML.Component | HTML.UpdatableComponent | null | undefined);
    getHTML(): HTML.Component | HTML.UpdatableComponent | null | undefined;
    setHTML(html: HTML.Component | HTML.UpdatableComponent | null | undefined, options?: Node.SetOptions): this;
    removeHTML(options?: Node.SetOptions): import("../../model/store").Store<Node.Properties>;
}
export declare namespace HTML {
    type Elem = string | HTMLElement | null | undefined;
    type UnionElem = Elem | ((this: Graph, node: Node) => Elem);
    interface Properties extends Node.Properties {
        html?: UnionElem | {
            render: UnionElem;
            shouldComponentUpdate?: boolean | ((this: Graph, node: Node) => boolean);
        };
    }
}
export declare namespace HTML {
    class View extends NodeView<HTML> {
        protected init(): void;
        confirmUpdate(flag: number): number;
        protected renderHTMLComponent(): void;
    }
    namespace View {
        const action: any;
    }
}
export declare namespace HTML {
}
export declare namespace HTML {
    type Component = HTMLElement | string | ((this: Graph, node: HTML) => HTMLElement | string);
    type UpdatableComponent = {
        render: Component;
        shouldComponentUpdate: boolean | ((this: Graph, node: HTML) => boolean);
    };
    const componentRegistry: Registry<Component | UpdatableComponent, import("../../types").KeyValue<Component | UpdatableComponent>, never>;
}
