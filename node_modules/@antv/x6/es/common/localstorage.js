import { Config } from '../global/config';
import { StringExt, FunctionExt } from '../util';
export var LocalStorage;
(function (LocalStorage) {
    const prefix = `${Config.prefixCls}.storage`;
    function insert(collection, doc, cb) {
        const id = doc.id || StringExt.uniqueId('doc-');
        const index = loadIndex(collection);
        index.keys.push(id);
        setItem(docKey(collection, id), doc);
        setItem(indexKey(collection), index);
        callback(cb, null, Object.assign(Object.assign({}, doc), { id }));
    }
    LocalStorage.insert = insert;
    function find(collection, query, cb) {
        const index = loadIndex(collection);
        const docs = [];
        if (query == null) {
            index.keys.forEach((id) => {
                const doc = getItem(docKey(collection, id));
                if (!doc) {
                    callback(cb, new Error(`No document found for an ID '${id}' from index.`));
                }
                else {
                    docs.push(doc);
                }
            });
            callback(cb, null, docs);
        }
        else if (query.id) {
            const doc = getItem(docKey(collection, query.id));
            callback(cb, null, doc ? [doc] : []);
        }
        else {
            callback(cb, null, []);
        }
    }
    LocalStorage.find = find;
    function remove(collection, query, cb) {
        const index = loadIndex(collection);
        if (query == null) {
            index.keys.forEach((id) => {
                localStorage.removeItem(docKey(collection, id));
            });
            localStorage.removeItem(indexKey(collection));
            callback(cb, null);
        }
        else if (query.id) {
            const idx = index.keys.indexOf(query.id);
            if (idx >= 0) {
                index.keys.splice(idx, 1);
            }
            localStorage.removeItem(docKey(collection, query.id));
            setItem(indexKey(collection), index);
            callback(cb, null);
        }
    }
    LocalStorage.remove = remove;
    // util
    // ----
    function callback(cb, err, ret) {
        if (cb) {
            FunctionExt.defer(() => {
                cb(err, ret);
            });
        }
    }
    function setItem(key, item) {
        localStorage.setItem(key, JSON.stringify(item));
    }
    function getItem(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    function loadIndex(collection) {
        const index = getItem(indexKey(collection));
        if (index) {
            if (index.keys == null) {
                index.keys = [];
            }
            return index;
        }
        return { keys: [] };
    }
    function docKey(collection, id) {
        return `${prefix}.${collection}.docs.${id}`;
    }
    function indexKey(collection) {
        return `${prefix}.${collection}.index`;
    }
})(LocalStorage || (LocalStorage = {}));
//# sourceMappingURL=localstorage.js.map