"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.port = void 0;
exports.port = {
    set: function (port) {
        if (port != null && typeof port === 'object' && port.id) {
            return port.id;
        }
        return port;
    },
};
//# sourceMappingURL=port.js.map