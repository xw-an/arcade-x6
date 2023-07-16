"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseWheelHandle = void 0;
var jquery_1 = __importDefault(require("jquery"));
var platform_1 = require("../platform");
var MouseWheelHandle = /** @class */ (function () {
    function MouseWheelHandle(target, onWheelCallback, onWheelGuard) {
        this.animationFrameId = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.eventName = platform_1.Platform.isEventSupported('wheel')
            ? 'wheel'
            : 'mousewheel';
        this.target = target;
        this.onWheelCallback = onWheelCallback;
        this.onWheelGuard = onWheelGuard;
        this.onWheel = this.onWheel.bind(this);
        this.didWheel = this.didWheel.bind(this);
    }
    MouseWheelHandle.prototype.enable = function () {
        if (platform_1.Platform.SUPPORT_PASSIVE) {
            this.target.addEventListener(this.eventName, this.onWheel, {
                passive: false,
            });
        }
        else {
            (0, jquery_1.default)(this.target).on('mousewheel', this.onWheel);
        }
    };
    MouseWheelHandle.prototype.disable = function () {
        if (platform_1.Platform.SUPPORT_PASSIVE) {
            this.target.removeEventListener(this.eventName, this.onWheel);
        }
        else {
            (0, jquery_1.default)(this.target).off('mousewheel');
        }
    };
    MouseWheelHandle.prototype.onWheel = function (e) {
        var _this = this;
        if (this.onWheelGuard != null && !this.onWheelGuard(e)) {
            return;
        }
        this.deltaX += e.deltaX;
        this.deltaY += e.deltaY;
        e.preventDefault();
        var changed;
        if (this.deltaX !== 0 || this.deltaY !== 0) {
            e.stopPropagation();
            changed = true;
        }
        if (changed === true && this.animationFrameId === 0) {
            this.animationFrameId = requestAnimationFrame(function () {
                _this.didWheel(e);
            });
        }
    };
    MouseWheelHandle.prototype.didWheel = function (e) {
        this.animationFrameId = 0;
        this.onWheelCallback(e, this.deltaX, this.deltaY);
        this.deltaX = 0;
        this.deltaY = 0;
    };
    return MouseWheelHandle;
}());
exports.MouseWheelHandle = MouseWheelHandle;
//# sourceMappingURL=mousewheel.js.map