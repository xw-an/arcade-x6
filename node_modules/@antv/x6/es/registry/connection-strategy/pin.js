import { Point } from '../../geometry';
function toPercentage(value, max) {
    if (max === 0) {
        return '0%';
    }
    return `${Math.round((value / max) * 100)}%`;
}
function pin(relative) {
    const strategy = (terminal, view, magnet, coords) => {
        return view.isEdgeElement(magnet)
            ? pinEdgeTerminal(relative, terminal, view, magnet, coords)
            : pinNodeTerminal(relative, terminal, view, magnet, coords);
    };
    return strategy;
}
function pinNodeTerminal(relative, data, view, magnet, coords) {
    const node = view.cell;
    const angle = node.getAngle();
    const bbox = view.getUnrotatedBBoxOfElement(magnet);
    const center = node.getBBox().getCenter();
    const pos = Point.create(coords).rotate(angle, center);
    let dx = pos.x - bbox.x;
    let dy = pos.y - bbox.y;
    if (relative) {
        dx = toPercentage(dx, bbox.width);
        dy = toPercentage(dy, bbox.height);
    }
    data.anchor = {
        name: 'topLeft',
        args: {
            dx,
            dy,
            rotate: true,
        },
    };
    return data;
}
function pinEdgeTerminal(relative, end, view, magnet, coords) {
    const connection = view.getConnection();
    if (!connection) {
        return end;
    }
    const length = connection.closestPointLength(coords);
    if (relative) {
        const totalLength = connection.length();
        end.anchor = {
            name: 'ratio',
            args: {
                ratio: length / totalLength,
            },
        };
    }
    else {
        end.anchor = {
            name: 'length',
            args: {
                length,
            },
        };
    }
    return end;
}
export const pinRelative = pin(true);
export const pinAbsolute = pin(false);
//# sourceMappingURL=pin.js.map