"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
var config_1 = require("../global/config");
var util_1 = require("../util");
var LocalStorage;
(function (LocalStorage) {
    var prefix = config_1.Config.prefixCls + ".storage";
    function insert(collection, doc, cb) {
        var id = doc.id || util_1.StringExt.uniqueId('doc-');
        var index = loadIndex(collection);
        index.keys.push(id);
        setItem(docKey(collection, id), doc);
        setItem(indexKey(collection), index);
        callback(cb, null, __assign(__assign({}, doc), { id: id }));
    }
    LocalStorage.insert = insert;
    function find(collection, query, cb) {
        var index = loadIndex(collection);
        var docs = [];
        if (query == null) {
            index.keys.forEach(function (id) {
                var doc = getItem(docKey(collection, id));
                if (!doc) {
                    callback(cb, new Error("No document found for an ID '" + id + "' from index."));
                }
                else {
                    docs.push(doc);
                }
            });
            callback(cb, null, docs);
        }
        else if (query.id) {
            var doc = getItem(docKey(collection, query.id));
            callback(cb, null, doc ? [doc] : []);
        }
        else {
            callback(cb, null, []);
        }
    }
    LocalStorage.find = find;
    function remove(collection, query, cb) {
        var index = loadIndex(collection);
        if (query == null) {
            index.keys.forEach(function (id) {
                localStorage.removeItem(docKey(collection, id));
            });
            localStorage.removeItem(indexKey(collection));
            callback(cb, null);
        }
        else if (query.id) {
            var idx = index.keys.indexOf(query.id);
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
            util_1.FunctionExt.defer(function () {
                cb(err, ret);
            });
        }
    }
    function setItem(key, item) {
        localStorage.setItem(key, JSON.stringify(item));
    }
    function getItem(key) {
        var item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    function loadIndex(collection) {
        var index = getItem(indexKey(collection));
        if (index) {
            if (index.keys == null) {
                index.keys = [];
            }
            return index;
        }
        return { keys: [] };
    }
    function docKey(collection, id) {
        return prefix + "." + collection + ".docs." + id;
    }
    function indexKey(collection) {
        return prefix + "." + collection + ".index";
    }
})(LocalStorage = exports.LocalStorage || (exports.LocalStorage = {}));
//# sourceMappingURL=localstorage.js.map