"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var disposable_1 = require("./disposable");
var TestDisposable = /** @class */ (function () {
    function TestDisposable() {
        this.count = 0;
    }
    Object.defineProperty(TestDisposable.prototype, "disposed", {
        get: function () {
            return this.count > 0;
        },
        enumerable: false,
        configurable: true
    });
    TestDisposable.prototype.dispose = function () {
        this.count += 1;
    };
    return TestDisposable;
}());
var AOPTest = /** @class */ (function (_super) {
    __extends(AOPTest, _super);
    function AOPTest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.a = 1;
        return _this;
    }
    AOPTest.prototype.dispose = function () {
        this.a = 0;
    };
    __decorate([
        disposable_1.Disposable.dispose()
    ], AOPTest.prototype, "dispose", null);
    return AOPTest;
}(disposable_1.Disposable));
describe('disposable', function () {
    describe('Disablable', function () {
        it('should be `false` before object is disposed', function () {
            var obj = new disposable_1.Disposable();
            expect(obj.disposed).toBe(false);
        });
        it('should be `true` after object is disposed', function () {
            var obj = new disposable_1.Disposable();
            obj.dispose();
            expect(obj.disposed).toBe(true);
        });
        // it('should add `unload` listener for ie', () => {
        //   const tmp = Platform as any
        //   tmp.IS_IE = true
        //   const obj = new Disposable()
        //   expect(obj.disposed).toBe(false)
        //   tmp.IS_IE = false
        //   window.dispatchEvent(new Event('unload'))
        //   expect(obj.disposed).toBe(true)
        // })
        it('shoule work with `aop`', function () {
            var obj = new AOPTest();
            expect(obj.disposed).toBe(false);
            expect(obj.a).toBe(1);
            obj.dispose();
            expect(obj.disposed).toBe(true);
            expect(obj.a).toBe(0);
            obj.dispose();
            expect(obj.disposed).toBe(true);
            expect(obj.a).toBe(0);
        });
    });
    describe('DisposableDelegate', function () {
        describe('#constructor', function () {
            it('should accept a callback', function () {
                var delegate = new disposable_1.DisposableDelegate(function () { });
                expect(delegate instanceof disposable_1.DisposableDelegate).toBeTruthy();
            });
        });
        describe('#disposed', function () {
            it('should be `false` before object is disposed', function () {
                var delegate = new disposable_1.DisposableDelegate(function () { });
                expect(delegate.disposed).toBe(false);
            });
            it('should be `true` after object is disposed', function () {
                var delegate = new disposable_1.DisposableDelegate(function () { });
                delegate.dispose();
                expect(delegate.disposed).toBe(true);
            });
        });
        describe('#dispose', function () {
            it('should invoke a callback when disposed', function () {
                var called = false;
                var delegate = new disposable_1.DisposableDelegate(function () { return (called = true); });
                expect(called).toBe(false);
                delegate.dispose();
                expect(called).toBe(true);
            });
            it('should ignore multiple calls to `dispose`', function () {
                var count = 0;
                var delegate = new disposable_1.DisposableDelegate(function () { return (count += 1); });
                expect(count).toBe(0);
                delegate.dispose();
                delegate.dispose();
                delegate.dispose();
                expect(count).toBe(1);
            });
        });
    });
    describe('DisposableSet', function () {
        describe('#constructor', function () {
            it('should accept no arguments', function () {
                var set = new disposable_1.DisposableSet();
                expect(set instanceof disposable_1.DisposableSet).toBeTruthy();
            });
        });
        describe('#disposed', function () {
            it('should be `false` before object is disposed', function () {
                var set = new disposable_1.DisposableSet();
                expect(set.disposed).toBe(false);
            });
            it('should be `true` after object is disposed', function () {
                var set = new disposable_1.DisposableSet();
                set.dispose();
                expect(set.disposed).toBe(true);
            });
        });
        describe('#dispose', function () {
            it('should dispose all items in the set', function () {
                var item1 = new TestDisposable();
                var item2 = new TestDisposable();
                var item3 = new TestDisposable();
                var set = disposable_1.DisposableSet.from([item1, item2, item3]);
                expect(item1.count).toBe(0);
                expect(item2.count).toBe(0);
                expect(item3.count).toBe(0);
                set.dispose();
                expect(item1.count).toBe(1);
                expect(item2.count).toBe(1);
                expect(item3.count).toBe(1);
            });
            it('should dipose items in the order they were added', function () {
                var values = [];
                var item1 = new disposable_1.DisposableDelegate(function () { return values.push(0); });
                var item2 = new disposable_1.DisposableDelegate(function () { return values.push(1); });
                var item3 = new disposable_1.DisposableDelegate(function () { return values.push(2); });
                var set = disposable_1.DisposableSet.from([item1, item2, item3]);
                expect(values).toEqual([]);
                set.dispose();
                expect(values).toEqual([0, 1, 2]);
            });
            it('should ignore multiple calls to `dispose`', function () {
                var item1 = new TestDisposable();
                var item2 = new TestDisposable();
                var item3 = new TestDisposable();
                var set = disposable_1.DisposableSet.from([item1, item2, item3]);
                expect(item1.count).toBe(0);
                expect(item2.count).toBe(0);
                expect(item3.count).toBe(0);
                set.dispose();
                set.dispose();
                set.dispose();
                expect(item1.count).toBe(1);
                expect(item2.count).toBe(1);
                expect(item3.count).toBe(1);
            });
        });
        describe('#add', function () {
            it('should add items to the set', function () {
                var item1 = new TestDisposable();
                var item2 = new TestDisposable();
                var item3 = new TestDisposable();
                var set = new disposable_1.DisposableSet();
                set.add(item1);
                set.add(item2);
                set.add(item3);
                expect(item1.count).toBe(0);
                expect(item2.count).toBe(0);
                expect(item3.count).toBe(0);
                set.dispose();
                expect(item1.count).toBe(1);
                expect(item2.count).toBe(1);
                expect(item3.count).toBe(1);
            });
            it('should maintain insertion order', function () {
                var values = [];
                var item1 = new disposable_1.DisposableDelegate(function () { return values.push(0); });
                var item2 = new disposable_1.DisposableDelegate(function () { return values.push(1); });
                var item3 = new disposable_1.DisposableDelegate(function () { return values.push(2); });
                var set = disposable_1.DisposableSet.from([item1]);
                set.add(item2);
                set.add(item3);
                expect(values).toEqual([]);
                set.dispose();
                expect(values).toEqual([0, 1, 2]);
            });
            it('should ignore duplicate items', function () {
                var values = [];
                var item1 = new disposable_1.DisposableDelegate(function () { return values.push(0); });
                var item2 = new disposable_1.DisposableDelegate(function () { return values.push(1); });
                var item3 = new disposable_1.DisposableDelegate(function () { return values.push(2); });
                var set = disposable_1.DisposableSet.from([item1]);
                set.add(item2);
                set.add(item3);
                set.add(item3);
                set.add(item2);
                set.add(item1);
                expect(values).toEqual([]);
                set.dispose();
                expect(values).toEqual([0, 1, 2]);
            });
        });
        describe('#contains', function () {
            it('should remove all items from the set after disposed', function () {
                var item1 = new TestDisposable();
                var item2 = new TestDisposable();
                var item3 = new TestDisposable();
                var set = new disposable_1.DisposableSet();
                set.add(item1);
                set.add(item2);
                set.add(item3);
                expect(set.contains(item1)).toBe(true);
                expect(set.contains(item2)).toBe(true);
                expect(set.contains(item3)).toBe(true);
                set.dispose();
                expect(set.contains(item1)).toBe(false);
                expect(set.contains(item2)).toBe(false);
                expect(set.contains(item3)).toBe(false);
            });
        });
        describe('#remove', function () {
            it('should remove items from the set', function () {
                var item1 = new TestDisposable();
                var item2 = new TestDisposable();
                var item3 = new TestDisposable();
                var set = disposable_1.DisposableSet.from([item1, item2, item3]);
                expect(item1.count).toBe(0);
                expect(item2.count).toBe(0);
                expect(item3.count).toBe(0);
                set.remove(item2);
                set.dispose();
                expect(item1.count).toBe(1);
                expect(item2.count).toBe(0);
                expect(item3.count).toBe(1);
            });
            it('should maintain insertion order', function () {
                var values = [];
                var item1 = new disposable_1.DisposableDelegate(function () { return values.push(0); });
                var item2 = new disposable_1.DisposableDelegate(function () { return values.push(1); });
                var item3 = new disposable_1.DisposableDelegate(function () { return values.push(2); });
                var set = disposable_1.DisposableSet.from([item1, item2, item3]);
                expect(values).toEqual([]);
                set.remove(item1);
                set.dispose();
                expect(values).toEqual([1, 2]);
            });
            it('should ignore missing items', function () {
                var values = [];
                var item1 = new disposable_1.DisposableDelegate(function () { return values.push(0); });
                var item2 = new disposable_1.DisposableDelegate(function () { return values.push(1); });
                var item3 = new disposable_1.DisposableDelegate(function () { return values.push(2); });
                var set = disposable_1.DisposableSet.from([item1, item2]);
                expect(values).toEqual([]);
                set.remove(item3);
                set.dispose();
                expect(values).toEqual([0, 1]);
            });
        });
        describe('#clear', function () {
            it('should remove all items from the set', function () {
                var item1 = new TestDisposable();
                var item2 = new TestDisposable();
                var item3 = new TestDisposable();
                var set = disposable_1.DisposableSet.from([item1, item2, item3]);
                expect(item1.count).toBe(0);
                expect(item2.count).toBe(0);
                expect(item3.count).toBe(0);
                set.clear();
                set.dispose();
                expect(item1.count).toBe(0);
                expect(item2.count).toBe(0);
                expect(item3.count).toBe(0);
            });
        });
        describe('#from', function () {
            it('should accept an iterable of disposable items', function () {
                var item1 = new TestDisposable();
                var item2 = new TestDisposable();
                var item3 = new TestDisposable();
                var set = disposable_1.DisposableSet.from([item1, item2, item3]);
                expect(set instanceof disposable_1.DisposableSet).toBeTruthy();
            });
        });
    });
});
//# sourceMappingURL=disposable.test.js.map