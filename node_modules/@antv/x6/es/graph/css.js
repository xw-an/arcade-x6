var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Config } from '../global/config';
import { content } from '../style/raw';
import { Platform } from '../util';
import { Base } from './base';
export class CSSManager extends Base {
    init() {
        if (Config.autoInsertCSS) {
            CSSManager.ensure();
        }
    }
    dispose() {
        CSSManager.clean();
    }
}
__decorate([
    CSSManager.dispose()
], CSSManager.prototype, "dispose", null);
(function (CSSManager) {
    let styleElement;
    let counter = 0;
    function ensure() {
        counter += 1;
        if (counter > 1)
            return;
        if (!Platform.isApplyingHMR()) {
            styleElement = document.createElement('style');
            styleElement.setAttribute('type', 'text/css');
            styleElement.textContent = content;
            const head = document.querySelector('head');
            if (head) {
                head.insertBefore(styleElement, head.firstChild);
            }
        }
    }
    CSSManager.ensure = ensure;
    function clean() {
        counter -= 1;
        if (counter > 0)
            return;
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        }
        styleElement = null;
    }
    CSSManager.clean = clean;
})(CSSManager || (CSSManager = {}));
//# sourceMappingURL=css.js.map