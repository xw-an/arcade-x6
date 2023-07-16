"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = void 0;
/* eslint-disable no-bitwise */
function uuid() {
    // credit: http://stackoverflow.com/posts/2117523/revisions
    // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    //   const r = (Math.random() * 16) | 0
    //   const v = c === 'x' ? r : (r & 0x3) | 0x8
    //   return v.toString(16)
    // })
    var res = '';
    var template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    for (var i = 0, len = template.length; i < len; i += 1) {
        var s = template[i];
        var r = (Math.random() * 16) | 0;
        var v = s === 'x' ? r : s === 'y' ? (r & 0x3) | 0x8 : s;
        res += v.toString(16);
    }
    return res;
}
exports.uuid = uuid;
//# sourceMappingURL=uuid.js.map