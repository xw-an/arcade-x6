/* eslint-disable no-underscore-dangle */
import { Basecoat } from './basecoat';
export class Disablable extends Basecoat {
    get disabled() {
        return this._disabled === true;
    }
    enable() {
        delete this._disabled;
    }
    disable() {
        this._disabled = true;
    }
}
//# sourceMappingURL=disablable.js.map