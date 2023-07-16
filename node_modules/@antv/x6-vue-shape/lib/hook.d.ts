import { Graph } from '@antv/x6';
import { Definition } from './registry';
import { VueShape } from './node';
declare module '@antv/x6/lib/graph/hook' {
    namespace Hook {
        interface IHook {
            getVueComponent(this: Graph, node: VueShape): Definition;
        }
    }
    interface Hook {
        getVueComponent(node: VueShape): Definition;
    }
}
