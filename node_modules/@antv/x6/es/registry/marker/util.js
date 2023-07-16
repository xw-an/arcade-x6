import { Path } from '../../geometry';
export function normalize(d, offset1, offset2) {
    let offsetX;
    let offsetY;
    if (typeof offset1 === 'object') {
        offsetX = offset1.x;
        offsetY = offset1.y;
    }
    else {
        offsetX = offset1;
        offsetY = offset2;
    }
    const path = Path.parse(d);
    const bbox = path.bbox();
    if (bbox) {
        let ty = -bbox.height / 2 - bbox.y;
        let tx = -bbox.width / 2 - bbox.x;
        if (typeof offsetX === 'number') {
            tx -= offsetX;
        }
        if (typeof offsetY === 'number') {
            ty -= offsetY;
        }
        path.translate(tx, ty);
    }
    return path.serialize();
}
//# sourceMappingURL=util.js.map