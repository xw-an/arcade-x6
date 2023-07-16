var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Util } from '../global';
import { ObjectExt } from '../util';
import { Edge as StandardEdge } from '../shape/standard/edge';
export var Options;
(function (Options) {
    function parseOptionGroup(graph, arg, options) {
        const result = {};
        Object.keys(options || {}).forEach((key) => {
            const val = options[key];
            result[key] = typeof val === 'function' ? val.call(graph, arg) : val;
        });
        return result;
    }
    Options.parseOptionGroup = parseOptionGroup;
})(Options || (Options = {}));
(function (Options) {
    function get(options) {
        const { grid, panning, selecting, embedding, snapline, resizing, rotating, knob, clipboard, history, scroller, minimap, keyboard, mousewheel } = options, others = __rest(options
        // size
        // ----
        , ["grid", "panning", "selecting", "embedding", "snapline", "resizing", "rotating", "knob", "clipboard", "history", "scroller", "minimap", "keyboard", "mousewheel"]);
        // size
        // ----
        const container = options.container;
        if (container != null) {
            if (others.width == null) {
                others.width = container.clientWidth;
            }
            if (others.height == null) {
                others.height = container.clientHeight;
            }
        }
        else {
            throw new Error(`Ensure the container of the graph is specified and valid`);
        }
        const result = ObjectExt.merge({}, Options.defaults, others);
        // grid
        // ----
        const defaultGrid = { size: 10, visible: false };
        if (typeof grid === 'number') {
            result.grid = { size: grid, visible: false };
        }
        else if (typeof grid === 'boolean') {
            result.grid = Object.assign(Object.assign({}, defaultGrid), { visible: grid });
        }
        else {
            result.grid = Object.assign(Object.assign({}, defaultGrid), grid);
        }
        // booleas
        // -------
        const booleas = [
            'panning',
            'selecting',
            'embedding',
            'snapline',
            'resizing',
            'rotating',
            'knob',
            'clipboard',
            'history',
            'scroller',
            'minimap',
            'keyboard',
            'mousewheel',
        ];
        booleas.forEach((key) => {
            const val = options[key];
            if (typeof val === 'boolean') {
                result[key].enabled = val;
            }
            else {
                result[key] = Object.assign(Object.assign({}, result[key]), val);
            }
        });
        // background
        // ----------
        if (result.background &&
            result.scroller.enabled &&
            result.scroller.background == null) {
            result.scroller.background = result.background;
            delete result.background;
        }
        return result;
    }
    Options.get = get;
})(Options || (Options = {}));
(function (Options) {
    Options.defaults = {
        x: 0,
        y: 0,
        grid: {
            size: 10,
            visible: false,
        },
        scaling: {
            min: 0.01,
            max: 16,
        },
        background: false,
        highlighting: {
            default: {
                name: 'stroke',
                args: {
                    padding: 3,
                },
            },
            nodeAvailable: {
                name: 'className',
                args: {
                    className: Util.prefix('available-node'),
                },
            },
            magnetAvailable: {
                name: 'className',
                args: {
                    className: Util.prefix('available-magnet'),
                },
            },
        },
        connecting: {
            snap: false,
            multi: true,
            // TODO: Unannotation the next line when the `multi` option was removed in the next major version.
            // allowMulti: true,
            dangling: true,
            // TODO: Unannotation the next line when the `dangling` option was removed in the next major version.
            // allowBlank: true,
            allowLoop: true,
            allowNode: true,
            allowEdge: false,
            allowPort: true,
            highlight: false,
            anchor: 'center',
            edgeAnchor: 'ratio',
            connectionPoint: 'boundary',
            strategy: null,
            router: 'normal',
            connector: 'normal',
            validateConnection({ type, sourceView, targetView }) {
                const view = type === 'target' ? targetView : sourceView;
                return view != null;
            },
            createEdge() {
                return new StandardEdge();
            },
        },
        transforming: {
            clearAll: true,
            clearOnBlankMouseDown: true,
        },
        resizing: {
            enabled: false,
            minWidth: 0,
            minHeight: 0,
            maxWidth: Number.MAX_SAFE_INTEGER,
            maxHeight: Number.MAX_SAFE_INTEGER,
            orthogonal: true,
            restricted: false,
            autoScroll: true,
            preserveAspectRatio: false,
            allowReverse: true,
        },
        rotating: {
            enabled: false,
            grid: 15,
        },
        translating: {
            restrict: false,
        },
        knob: {
            enabled: false,
            clearAll: true,
            clearOnBlankMouseDown: true,
        },
        embedding: {
            enabled: false,
            findParent: 'bbox',
            frontOnly: true,
            validate: () => true,
        },
        selecting: {
            enabled: false,
            rubberband: false,
            rubberNode: true,
            rubberEdge: false,
            pointerEvents: 'auto',
            multiple: true,
            multipleSelectionModifiers: ['ctrl', 'meta'],
            movable: true,
            strict: false,
            useCellGeometry: false,
            selectCellOnMoved: false,
            selectNodeOnMoved: false,
            selectEdgeOnMoved: false,
            content: null,
            handles: null,
        },
        panning: {
            enabled: false,
            eventTypes: ['leftMouseDown'],
        },
        snapline: {
            enabled: false,
        },
        clipboard: {
            enabled: false,
        },
        history: {
            enabled: false,
        },
        scroller: {
            enabled: false,
        },
        keyboard: {
            enabled: false,
        },
        mousewheel: {
            enabled: false,
            factor: 1.2,
            zoomAtMousePosition: true,
        },
        async: false,
        frozen: false,
        sorting: 'exact',
        moveThreshold: 0,
        clickThreshold: 0,
        magnetThreshold: 0,
        preventDefaultDblClick: true,
        preventDefaultMouseDown: false,
        preventDefaultContextMenu: true,
        preventDefaultBlankAction: true,
        interacting: {
            edgeLabelMovable: false,
        },
        guard: () => false,
    };
})(Options || (Options = {}));
//# sourceMappingURL=options.js.map