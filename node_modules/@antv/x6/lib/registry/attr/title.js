"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.title = void 0;
exports.title = {
    qualify: function (title, _a) {
        var elem = _a.elem;
        // HTMLElement title is specified via an attribute (i.e. not an element)
        return elem instanceof SVGElement;
    },
    set: function (val, _a) {
        var view = _a.view, elem = _a.elem;
        var cacheName = 'x6-title';
        var title = "" + val;
        var $elem = view.$(elem);
        var cache = $elem.data(cacheName);
        if (cache == null || cache !== title) {
            $elem.data(cacheName, title);
            // Generally SVGTitleElement should be the first child
            // element of its parent.
            var firstChild = elem.firstChild;
            if (firstChild && firstChild.tagName.toUpperCase() === 'TITLE') {
                // Update an existing title
                var titleElem = firstChild;
                titleElem.textContent = title;
            }
            else {
                // Create a new title
                var titleNode = document.createElementNS(elem.namespaceURI, 'title');
                titleNode.textContent = title;
                elem.insertBefore(titleNode, firstChild);
            }
        }
    },
};
//# sourceMappingURL=title.js.map