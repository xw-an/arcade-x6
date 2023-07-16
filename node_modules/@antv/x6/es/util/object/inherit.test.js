import { inherit, createClass } from './inherit';
describe('object', () => {
    class Parent {
        constructor(name, age) {
            this.name = name;
            this.age = age;
        }
        static hello() {
            return 'hello';
        }
        sayName() {
            return this.name;
        }
    }
    class Child {
        constructor(name, age, gender) {
            this.name = name;
            this.age = age;
            this.gender = gender;
        }
    }
    describe('inherit', () => {
        it('should access the parent function and static function', () => {
            inherit(Child, Parent);
            const c = new Child('cat', 25, 'male');
            expect(c.name).toBe('cat');
            expect(c.age).toBe(25);
            expect(c.gender).toBe('male');
            expect(c.sayName()).toBe('cat');
            expect(Child.hello()).toBe('hello');
        });
    });
    describe('createClass', () => {
        it('should create class extend parent', () => {
            const cls = createClass('Test', Parent);
            expect(Object.getPrototypeOf(cls) === Parent).toBeTruthy();
        });
    });
});
//# sourceMappingURL=inherit.test.js.map