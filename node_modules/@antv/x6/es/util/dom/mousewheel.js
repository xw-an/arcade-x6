import JQuery from 'jquery';
import { Platform } from '../platform';
export class MouseWheelHandle {
    constructor(target, onWheelCallback, onWheelGuard) {
        this.animationFrameId = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.eventName = Platform.isEventSupported('wheel')
            ? 'wheel'
            : 'mousewheel';
        this.target = target;
        this.onWheelCallback = onWheelCallback;
        this.onWheelGuard = onWheelGuard;
        this.onWheel = this.onWheel.bind(this);
        this.didWheel = this.didWheel.bind(this);
    }
    enable() {
        if (Platform.SUPPORT_PASSIVE) {
            this.target.addEventListener(this.eventName, this.onWheel, {
                passive: false,
            });
        }
        else {
            JQuery(this.target).on('mousewheel', this.onWheel);
        }
    }
    disable() {
        if (Platform.SUPPORT_PASSIVE) {
            this.target.removeEventListener(this.eventName, this.onWheel);
        }
        else {
            JQuery(this.target).off('mousewheel');
        }
    }
    onWheel(e) {
        if (this.onWheelGuard != null && !this.onWheelGuard(e)) {
            return;
        }
        this.deltaX += e.deltaX;
        this.deltaY += e.deltaY;
        e.preventDefault();
        let changed;
        if (this.deltaX !== 0 || this.deltaY !== 0) {
            e.stopPropagation();
            changed = true;
        }
        if (changed === true && this.animationFrameId === 0) {
            this.animationFrameId = requestAnimationFrame(() => {
                this.didWheel(e);
            });
        }
    }
    didWheel(e) {
        this.animationFrameId = 0;
        this.onWheelCallback(e, this.deltaX, this.deltaY);
        this.deltaX = 0;
        this.deltaY = 0;
    }
}
//# sourceMappingURL=mousewheel.js.map