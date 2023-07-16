import { ObjectExt } from '../util';
import { Events } from './events';
import { Disposable } from './disposable';
export class Basecoat extends Events {
}
(function (Basecoat) {
    Basecoat.dispose = Disposable.dispose;
})(Basecoat || (Basecoat = {}));
ObjectExt.applyMixins(Basecoat, Disposable);
//# sourceMappingURL=basecoat.js.map