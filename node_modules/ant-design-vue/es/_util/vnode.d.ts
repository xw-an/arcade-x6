import type { VNode, VNodeProps } from 'vue';
import type { RefObject } from './createRef';
export declare function cloneElement<T, U>(vnode: VNode<T, U> | VNode<T, U>[], nodeProps?: Record<string, any> & Omit<VNodeProps, 'ref'> & {
    ref?: VNodeProps['ref'] | RefObject;
}, override?: boolean, mergeRef?: boolean): VNode<T, U>;
export declare function cloneVNodes(vnodes: any, nodeProps?: {}, override?: boolean): any;
