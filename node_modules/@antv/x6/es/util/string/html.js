import JQuery from 'jquery';
export function sanitizeHTML(html, options = {}) {
    // If documentContext (second parameter) is not specified or given as
    // `null` or `undefined`, a new document is used. Inline events will not
    // execute when the HTML is parsed; this includes, for example, sending
    // GET requests for images.
    // If keepScripts (last parameter) is `false`, scripts are not executed.
    const nodes = JQuery.parseHTML(html, null, false);
    nodes.forEach((node) => {
        const elem = node;
        if (elem) {
            const attrs = elem.attributes;
            if (attrs) {
                for (let i = 0, ii = attrs.length; i < ii; i += 1) {
                    const attr = attrs.item(i);
                    if (attr) {
                        const val = attr.value.toLowerCase();
                        const name = attr.name.toLowerCase();
                        // Removes attribute name starts with "on" (e.g. onload,
                        // onerror...).
                        // Removes attribute value starts with "javascript:" pseudo
                        // protocol (e.g. `href="javascript:alert(1)"`).
                        if (name.startsWith('on') ||
                            val.startsWith('javascript:') || // eslint-disable-line no-script-url
                            // ref: https://lgtm.com/rules/1510852698359/
                            val.startsWith('data:') ||
                            val.startsWith('vbscript:')) {
                            elem.removeAttribute(name);
                        }
                    }
                }
            }
        }
    });
    if (options.raw) {
        return nodes;
    }
    return JQuery('<div/>').append(nodes).html();
}
//# sourceMappingURL=html.js.map