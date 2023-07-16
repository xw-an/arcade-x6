"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = require("./object");
describe('Object', function () {
    var obj = {
        name: 'x6',
        age: 1,
        gender: null,
        tall: true,
    };
    describe('#getValue', function () {
        it('should return a value of a object', function () {
            expect((0, object_1.getValue)(obj, 'name')).toBe('x6');
            expect((0, object_1.getValue)(obj, 'age')).toBe(1);
            expect((0, object_1.getValue)(obj, 'gender')).toBe(null);
            expect((0, object_1.getValue)(obj, 'count')).toBe(undefined);
        });
        it('should return a defaultValue of a object', function () {
            expect((0, object_1.getValue)(obj, 'gender', 'male')).toBe('male');
            expect((0, object_1.getValue)(obj, 'count', 100)).toBe(100);
        });
    });
    describe('#getNumber', function () {
        it('should return a number value of a object', function () {
            expect((0, object_1.getNumber)(obj, 'age', 2)).toBe(1);
        });
        it('should return a defaultValue of a object', function () {
            expect((0, object_1.getNumber)(obj, 'name', 10)).toBe(10);
            expect((0, object_1.getNumber)(obj, 'count', 20)).toBe(20);
        });
    });
    describe('#getBoolean', function () {
        it('should return a boolean value of a object', function () {
            expect((0, object_1.getBoolean)(obj, 'tall', false)).toBe(true);
            expect((0, object_1.getBoolean)(obj, 'name', false)).toBe(true);
            expect((0, object_1.getBoolean)(obj, 'age', false)).toBe(true);
        });
        it('should return a defaultValue of a object', function () {
            expect((0, object_1.getBoolean)(obj, 'gender', false)).toBe(false);
            expect((0, object_1.getBoolean)(obj, 'count', true)).toBe(true);
        });
    });
    describe('#getByPath#setByPath', function () {
        var project = {
            name: 'x6',
            version: ['0.1', '0.2', '0.3'],
            attr: {
                node: {
                    fontSize: 14,
                },
                edge: {
                    color: 'red',
                },
            },
        };
        it('should set or get object value by path', function () {
            expect((0, object_1.getByPath)(project, 'version/1')).toBe('0.2');
            expect((0, object_1.getByPath)(project, 'attr/node/fontSize')).toBe(14);
            expect((0, object_1.getByPath)(project, 'attr/node/color')).toBe(undefined);
            (0, object_1.setByPath)(project, 'version/1', '0.8');
            (0, object_1.setByPath)(project, 'attr/node/fontSize', 16);
            (0, object_1.setByPath)(project, 'attr/node/color', 'green');
            expect((0, object_1.getByPath)(project, 'version/1')).toBe('0.8');
            expect((0, object_1.getByPath)(project, 'attr/node/fontSize')).toBe(16);
            expect((0, object_1.getByPath)(project, 'attr/node/color')).toBe('green');
            (0, object_1.unsetByPath)(project, 'version/1');
            (0, object_1.unsetByPath)(project, 'attr/node/fontSize');
            expect((0, object_1.getByPath)(project, 'version/1')).toBe(undefined);
            expect((0, object_1.getByPath)(project, 'attr/node/fontSize')).toBe(undefined);
        });
    });
    describe('#flatten', function () {
        var project = {
            name: 'x6',
            version: ['0.1', '0.2', '0.3'],
            attr: {
                node: {
                    fontSize: 14,
                },
                edge: {
                    color: 'red',
                },
            },
        };
        it('should return flatten object', function () {
            expect((0, object_1.flatten)(project)).toEqual({
                name: 'x6',
                'version/0': '0.1',
                'version/1': '0.2',
                'version/2': '0.3',
                'attr/node/fontSize': 14,
                'attr/edge/color': 'red',
            });
        });
    });
});
//# sourceMappingURL=object.test.js.map