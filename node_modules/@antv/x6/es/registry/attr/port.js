export const port = {
    set(port) {
        if (port != null && typeof port === 'object' && port.id) {
            return port.id;
        }
        return port;
    },
};
//# sourceMappingURL=port.js.map