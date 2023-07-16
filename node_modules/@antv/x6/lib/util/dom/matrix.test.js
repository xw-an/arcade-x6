"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var matrix_1 = require("./matrix");
var elem_1 = require("./elem");
var vector_1 = require("../vector");
var geometry_1 = require("../../geometry");
describe('Dom', function () {
    describe('matrix', function () {
        var fixture = document.createElement('div');
        var svgContainer = vector_1.Vector.create('svg').node;
        fixture.appendChild(svgContainer);
        document.body.appendChild(fixture);
        afterAll(function () {
            var _a;
            (_a = fixture.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(fixture);
        });
        describe('createSVGTransform', function () {
            it('should return SVG transform object', function () {
                var svgDocument = (0, elem_1.createSvgElement)('svg');
                var matrix = svgDocument.createSVGMatrix();
                expect((0, matrix_1.createSVGTransform)(matrix)).toBeInstanceOf(SVGTransform);
                expect((0, matrix_1.createSVGTransform)({
                    a: 1,
                    b: 0,
                    c: 0,
                    d: 1,
                    e: 0,
                    f: 0,
                })).toBeInstanceOf(SVGTransform);
            });
        });
        describe('#transformPoint', function () {
            var p = { x: 1, y: 2 };
            var group = vector_1.Vector.create('g');
            var node = group.node;
            svgContainer.appendChild(group.node);
            it('should return the point unchanged when transformed without transformation', function () {
                var t = (0, matrix_1.transformPoint)(p, node.getCTM());
                expect(t.equals(p)).toBe(true);
            });
            it('should returns correct point when transformed with scale transformation', function () {
                group.scale(2, 3);
                var t = (0, matrix_1.transformPoint)(p, node.getCTM());
                expect(t.equals({ x: 2, y: 6 })).toBe(true);
            });
            it('should returns correct point when transformed with rotate transformation', function () {
                group.attr('transform', 'rotate(90)');
                var t = (0, matrix_1.transformPoint)(p, node.getCTM());
                expect(t.equals({ x: -2, y: 1 })).toBe(true);
            });
        });
        describe('#transformLine', function () {
            var matrix = (0, matrix_1.createSVGMatrix)().translate(50, 50);
            var line = new geometry_1.Line(new geometry_1.Point(0, 0), new geometry_1.Point(10, 10));
            it('should return the transformed line', function () {
                var l = (0, matrix_1.transformLine)(line, matrix);
                expect(l.start.x).toBe(50);
                expect(l.start.y).toBe(50);
            });
        });
        describe('#transformPolyline', function () {
            var matrix = (0, matrix_1.createSVGMatrix)().translate(50, 50);
            var points = [new geometry_1.Point(0, 0), new geometry_1.Point(10, 10)];
            var polyline = new geometry_1.Polyline(points);
            it('should return transformed polyline', function () {
                var _a, _b;
                var p = (0, matrix_1.transformPolyline)(polyline, matrix);
                expect((_a = p.pointAt(0)) === null || _a === void 0 ? void 0 : _a.x).toBe(50);
                expect((_b = p.pointAt(0)) === null || _b === void 0 ? void 0 : _b.y).toBe(50);
            });
        });
        describe('#getTransformToElement', function () {
            it('rotate', function () {
                var normalizeFloat = function (value) {
                    var temp = value * 100;
                    return temp > 0 ? Math.floor(temp) : Math.ceil(temp);
                };
                var container = vector_1.Vector.create(svgContainer);
                var group = vector_1.Vector.create('g');
                var rect = vector_1.Vector.create('rect');
                container.append(group);
                container.append(rect);
                rect.rotate(45);
                var matrix = group.getTransformToElement(rect.node);
                expect({
                    a: normalizeFloat(matrix.a),
                    b: normalizeFloat(matrix.b),
                    c: normalizeFloat(matrix.c),
                    d: normalizeFloat(matrix.d),
                    e: normalizeFloat(matrix.e),
                    f: normalizeFloat(matrix.f),
                }).toEqual({
                    a: normalizeFloat(0.7071067811865476),
                    b: normalizeFloat(-0.7071067811865475),
                    c: normalizeFloat(0.7071067811865475),
                    d: normalizeFloat(0.7071067811865476),
                    e: normalizeFloat(0),
                    f: normalizeFloat(0),
                });
                group.remove();
                rect.remove();
            });
            it('translate', function () {
                var container = vector_1.Vector.create(svgContainer);
                var group = vector_1.Vector.create('g');
                var rect = vector_1.Vector.create('rect');
                container.append(group);
                container.append(rect);
                rect.translate(10, 10);
                var matrix = group.getTransformToElement(rect.node);
                expect({
                    a: matrix.a,
                    b: matrix.b,
                    c: matrix.c,
                    d: matrix.d,
                    e: matrix.e,
                    f: matrix.f,
                }).toEqual({
                    a: 1,
                    b: 0,
                    c: 0,
                    d: 1,
                    e: -10,
                    f: -10,
                });
                group.remove();
                rect.remove();
            });
        });
        describe('#parseTransformString', function () {
            it('should parse scale, rotate, translate', function () {
                var parsed = (0, matrix_1.parseTransformString)('scale(3) rotate(6) translate(9) xxx(11)');
                expect(parsed.scale).toEqual({ sx: 3, sy: 3 });
                expect(parsed.rotation).toEqual({
                    angle: 6,
                    cx: undefined,
                    cy: undefined,
                });
                expect(parsed.translation).toEqual({ tx: 9, ty: 0 });
            });
            it('should parse martix', function () {
                var parsed = (0, matrix_1.parseTransformString)('matrix(1,0,0,1,30,30)');
                expect(parsed.scale).toEqual({ sx: 1, sy: 1 });
                expect(parsed.rotation).toEqual({
                    angle: 0,
                    cx: undefined,
                    cy: undefined,
                });
                expect(parsed.translation).toEqual({ tx: 30, ty: 30 });
            });
        });
        describe('#transformStringToMatrix', function () {
            var svgTestGroup;
            beforeEach(function () {
                svgTestGroup = vector_1.Vector.create('g');
                svgContainer.appendChild(svgTestGroup.node);
            });
            afterEach(function () {
                svgTestGroup.remove();
            });
            var arr = [
                '',
                'scale(2)',
                'scale(2,3)',
                'scale(2.5,3.1)',
                'translate(10, 10)',
                'translate(10,10)',
                'translate(10.2,11.6)',
                'rotate(10)',
                'rotate(10,100,100)',
                'skewX(40)',
                'skewY(60)',
                'scale(2,2) matrix(1 0 0 1 10 10)',
                'matrix(1 0 0 1 10 10) scale(2,2)',
                'rotate(10,100,100) matrix(1 0 0 1 10 10) scale(2,2) translate(10,20)',
            ];
            arr.forEach(function (transformString) {
                it("should convert \"" + transformString + "\" to matrix", function () {
                    svgTestGroup.attr('transform', transformString);
                    expect((0, matrix_1.transformStringToMatrix)(transformString)).toEqual(svgTestGroup.node.getCTM());
                });
            });
        });
        describe('#matrixToTransformString', function () {
            it('should return correct transformation string', function () {
                expect((0, matrix_1.matrixToTransformString)()).toEqual('matrix(1,0,0,1,0,0)');
                expect((0, matrix_1.matrixToTransformString)({ a: 2, d: 2 })).toEqual('matrix(2,0,0,2,0,0)');
                expect((0, matrix_1.matrixToTransformString)({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 })).toEqual('matrix(1,2,3,4,5,6)');
                expect((0, matrix_1.matrixToTransformString)((0, matrix_1.createSVGMatrix)({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 }))).toEqual('matrix(1,2,3,4,5,6)');
                expect((0, matrix_1.matrixToTransformString)({ a: 0, b: 1, c: 1, d: 0, e: 0, f: 0 })).toEqual('matrix(0,1,1,0,0,0)');
            });
        });
        describe('#matrixTo[Transformation]', function () {
            function roundObject(obj) {
                // eslint-disable-next-line
                for (var i in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, i)) {
                        obj[i] = Math.round(obj[i]);
                    }
                }
                return obj;
            }
            it('should convert matrix to rotation metadata', function () {
                var angle;
                angle = (0, matrix_1.matrixToRotation)((0, matrix_1.createSVGMatrix)().rotate(45));
                expect(roundObject(angle)).toEqual({ angle: 45 });
                angle = (0, matrix_1.matrixToRotation)((0, matrix_1.createSVGMatrix)().translate(50, 50).rotate(15));
                expect(roundObject(angle)).toEqual({ angle: 15 });
                angle = (0, matrix_1.matrixToRotation)((0, matrix_1.createSVGMatrix)().translate(50, 50).rotate(60).scale(2));
                expect(roundObject(angle)).toEqual({ angle: 60 });
                angle = (0, matrix_1.matrixToRotation)((0, matrix_1.createSVGMatrix)().rotate(60).rotate(60));
                expect(roundObject(angle)).toEqual({ angle: 120 });
            });
            it('should convert matrix to translation medata', function () {
                var translate;
                translate = (0, matrix_1.matrixToTranslation)((0, matrix_1.createSVGMatrix)().translate(10, 20));
                expect(roundObject(translate)).toEqual({ tx: 10, ty: 20 });
                translate = (0, matrix_1.matrixToTranslation)((0, matrix_1.createSVGMatrix)().translate(10, 20).rotate(10, 20).scale(2));
                expect(roundObject(translate)).toEqual({ tx: 10, ty: 20 });
                translate = (0, matrix_1.matrixToTranslation)((0, matrix_1.createSVGMatrix)().translate(10, 20).translate(30, 40));
                expect(roundObject(translate)).toEqual({ tx: 40, ty: 60 });
            });
            it('should convert matrix to scaling metadata', function () {
                var scale;
                scale = (0, matrix_1.matrixToScale)((0, matrix_1.createSVGMatrix)().scale(2));
                expect(roundObject(scale)).toEqual({ sx: 2, sy: 2 });
                scale = (0, matrix_1.matrixToScale)((0, matrix_1.createSVGMatrix)()
                    .translate(15, 15)
                    .scaleNonUniform(2, 3)
                    .rotate(10, 20));
                expect(roundObject(scale)).toEqual({ sx: 2, sy: 3 });
                scale = (0, matrix_1.matrixToScale)((0, matrix_1.createSVGMatrix)().scale(2, 2).scale(3, 3));
                expect(roundObject(scale)).toEqual({ sx: 6, sy: 6 });
            });
        });
    });
});
//# sourceMappingURL=matrix.test.js.map