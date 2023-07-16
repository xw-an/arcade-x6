import { KeyValue } from '../../types';
import { ToolsView } from '../../view/tool';
import { Registry } from '../registry';
import { Button } from './button';
import { Boundary } from './boundary';
import { Vertices } from './vertices';
import { Segments } from './segments';
export declare namespace NodeTool {
    const presets: {
        boundary: typeof Boundary;
        button: typeof Button;
        'button-remove': typeof ToolsView.ToolItem;
        'node-editor': typeof ToolsView.ToolItem;
    };
    type Definition = ToolsView.ToolItem.Definition;
    const registry: Registry<ToolsView.ToolItem.Definition, {
        boundary: typeof Boundary;
        button: typeof Button;
        'button-remove': typeof ToolsView.ToolItem;
        'node-editor': typeof ToolsView.ToolItem;
    }, ToolsView.ToolItem.Options & {
        inherit?: string | undefined;
    } & KeyValue<any>>;
}
export declare namespace NodeTool {
    type Presets = typeof NodeTool['presets'];
    type OptionsMap = {
        readonly [K in keyof Presets]-?: ConstructorParameters<Presets[K]>[0];
    };
    type NativeNames = keyof Presets;
    interface NativeItem<T extends NativeNames = NativeNames> {
        name: T;
        args?: OptionsMap[T];
    }
    interface ManaualItem {
        name: Exclude<string, NativeNames>;
        args?: ToolsView.ToolItem.Options;
    }
}
export declare namespace EdgeTool {
    const presets: {
        boundary: typeof Boundary;
        vertices: typeof Vertices;
        segments: typeof Segments;
        button: typeof Button;
        'button-remove': typeof ToolsView.ToolItem;
        'source-anchor': typeof ToolsView.ToolItem;
        'target-anchor': typeof ToolsView.ToolItem;
        'source-arrowhead': typeof ToolsView.ToolItem;
        'target-arrowhead': typeof ToolsView.ToolItem;
        'edge-editor': typeof ToolsView.ToolItem;
    };
    type Definition = NodeTool.Definition;
    const registry: Registry<ToolsView.ToolItem.Definition, {
        boundary: typeof Boundary;
        vertices: typeof Vertices;
        segments: typeof Segments;
        button: typeof Button;
        'button-remove': typeof ToolsView.ToolItem;
        'source-anchor': typeof ToolsView.ToolItem;
        'target-anchor': typeof ToolsView.ToolItem;
        'source-arrowhead': typeof ToolsView.ToolItem;
        'target-arrowhead': typeof ToolsView.ToolItem;
        'edge-editor': typeof ToolsView.ToolItem;
    }, ToolsView.ToolItem.Options & {
        inherit?: string | undefined;
    } & KeyValue<any>>;
}
export declare namespace EdgeTool {
    type Presets = typeof EdgeTool['presets'];
    type OptionsMap = {
        readonly [K in keyof Presets]-?: ConstructorParameters<Presets[K]>[0];
    };
    type NativeNames = keyof Presets;
    interface NativeItem<T extends NativeNames = NativeNames> {
        name: T;
        args?: OptionsMap[T];
    }
    interface ManaualItem {
        name: Exclude<string, NativeNames>;
        args?: ToolsView.ToolItem.Options;
    }
}
