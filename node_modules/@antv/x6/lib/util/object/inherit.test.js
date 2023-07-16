"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inherit_1 = require("./inherit");
describe('object', function () {
    var Parent = /** @class */ (function () {
        function Parent(name, age) {
            this.name = name;
            this.age = age;
        }
        Parent.hello = function () {
            return 'hello';
        };
        Parent.prototype.sayName = function () {
            return this.name;
        };
        return Parent;
    }());
    var Child = /** @class */ (function () {
        function Child(name, age, gender) {
            this.name = name;
            this.age = age;
            this.gender = gender;
        }
        return Child;
    }());
    describe('inherit', function () {
        it('should access the parent function and static function', function () {
            (0, inherit_1.inherit)(Child, Parent);
            var c = new Child('cat', 25, 'male');
            expect(c.name).toBe('cat');
            expect(c.age).toBe(25);
            expect(c.gender).toBe('male');
            expect(c.sayName()).toBe('cat');
            expect(Child.hello()).toBe('hello');
        });
    });
    describe('createClass', function () {
        it('should create class extend parent', function () {
            var cls = (0, inherit_1.createClass)('Test', Parent);
            expect(Object.getPrototypeOf(cls) === Parent).toBeTruthy();
        });
    });
});
//# sourceMappingURL=inherit.test.js.map