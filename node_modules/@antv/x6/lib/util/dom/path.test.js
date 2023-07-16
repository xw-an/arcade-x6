"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var elem_test_1 = require("./elem.test");
var vector_1 = require("../vector");
var path_1 = require("./path");
describe('Dom', function () {
    describe('path', function () {
        var _a = (0, elem_test_1.setupTest)(), svgContainer = _a.svgContainer, svgPath = _a.svgPath, svgGroup = _a.svgGroup, svgCircle = _a.svgCircle, svgEllipse = _a.svgEllipse, svgPolygon = _a.svgPolygon, svgText = _a.svgText, svgRectangle = _a.svgRectangle, svgGroup1 = _a.svgGroup1, svgGroup2 = _a.svgGroup2, svgGroup3 = _a.svgGroup3, svgPath2 = _a.svgPath2, svgPath3 = _a.svgPath3;
        afterAll(function () { return (0, elem_test_1.clearnTest)(); });
        describe('#toPath', function () {
            it('should convert SVGPathElement', function () {
                var path = vector_1.Vector.create('path', { d: 'M 100 50 L 200 150' });
                expect(path.toPath().getAttribute('d')).toBe('M 100 50 L 200 150');
            });
        });
        describe('#toPathData', function () {
            function roundPathData(pathData) {
                return pathData != null
                    ? pathData
                        .split(' ')
                        .map(function (command) {
                        var number = parseInt(command, 10);
                        if (Number.isNaN(number)) {
                            return command;
                        }
                        return number.toFixed(0);
                    })
                        .join(' ')
                    : null;
            }
            it('should throw an exception on convert an invalid SvgElement', function () {
                expect(function () {
                    var group = vector_1.Vector.create('<group/>');
                    (0, path_1.toPathData)(group.node);
                }).toThrowError();
            });
            it('should convert SVGPathElement', function () {
                var path = vector_1.Vector.create('path', { d: 'M 100 50 L 200 150' });
                expect(path.toPathData()).toEqual('M 100 50 L 200 150');
            });
            it('should convert SVGLineElement', function () {
                var line = vector_1.Vector.create('line', {
                    x1: 100,
                    y1: 50,
                    x2: 200,
                    y2: 150,
                });
                expect(line.toPathData()).toEqual('M 100 50 L 200 150');
            });
            it('should convert SVGRectElement', function () {
                var rect = vector_1.Vector.create('rect', {
                    x: 100,
                    y: 50,
                    width: 200,
                    height: 150,
                });
                expect(rect.toPathData()).toEqual('M 100 50 H 300 V 200 H 100 V 50 Z');
            });
            it('should convert SVGRectElement with `rx` and `ry` attributes', function () {
                var rect = vector_1.Vector.create('<rect/>', {
                    x: 100,
                    y: 50,
                    width: 200,
                    height: 150,
                    rx: 200,
                    ry: 200,
                });
                expect(rect.toPathData()).toEqual('M 100 125 v 0 a 100 75 0 0 0 100 75 h 0 a 100 75 0 0 0 100 -75 v 0 a 100 75 0 0 0 -100 -75 h 0 a 100 75 0 0 0 -100 75 Z');
            });
            it('should convert SVGCircleElement', function () {
                var circle = vector_1.Vector.create('circle', { cx: 100, cy: 50, r: 50 });
                expect(roundPathData(circle.toPathData())).toEqual('M 100 0 C 127 0 150 22 150 50 C 150 77 127 100 100 100 C 72 100 50 77 50 50 C 50 22 72 0 100 0 Z');
            });
            it('should convert SVGEllipseElement', function () {
                var ellipse = vector_1.Vector.create('ellipse', {
                    cx: 100,
                    cy: 50,
                    rx: 100,
                    ry: 50,
                });
                expect(roundPathData(ellipse.toPathData())).toEqual('M 100 0 C 155 0 200 22 200 50 C 200 77 155 100 100 100 C 44 100 0 77 0 50 C 0 22 44 0 100 0 Z');
            });
            it('should convert SVGPolygonElement', function () {
                var polygon = vector_1.Vector.create('polygon', {
                    points: '200,10 250,190 160,210',
                });
                expect(polygon.toPathData()).toEqual('M 200 10 L250 190 L160 210 Z');
            });
            it('should convert SVGPolylineElement', function () {
                var polyline = vector_1.Vector.create('polyline', {
                    points: '100,10 200,10 150,110',
                });
                expect(polyline.toPathData()).toEqual('M 100 10 L200 10 L150 110');
            });
        });
        describe('#normalizePath', function () {
            it('should return this for any SVGElement', function () {
                expect(vector_1.Vector.create(svgPath).normalizePath()).toBeInstanceOf(vector_1.Vector);
                expect(vector_1.Vector.create(svgPath2).normalizePath()).toBeInstanceOf(vector_1.Vector);
                expect(vector_1.Vector.create(svgPath3).normalizePath()).toBeInstanceOf(vector_1.Vector);
                expect(vector_1.Vector.create(svgContainer).normalizePath()).toBeInstanceOf(vector_1.Vector);
                expect(vector_1.Vector.create(svgGroup).normalizePath()).toBeInstanceOf(vector_1.Vector);
                expect(vector_1.Vector.create(svgCircle).normalizePath()).toBeInstanceOf(vector_1.Vector);
                expect(vector_1.Vector.create(svgEllipse).normalizePath()).toBeInstanceOf(vector_1.Vector);
                expect(vector_1.Vector.create(svgPolygon).normalizePath()).toBeInstanceOf(vector_1.Vector);
                expect(vector_1.Vector.create(svgText).normalizePath()).toBeInstanceOf(vector_1.Vector);
                expect(vector_1.Vector.create(svgRectangle).normalizePath()).toBeInstanceOf(vector_1.Vector);
                expect(vector_1.Vector.create(svgGroup1).normalizePath()).toBeInstanceOf(vector_1.Vector);
                expect(vector_1.Vector.create(svgGroup2).normalizePath()).toBeInstanceOf(vector_1.Vector);
                expect(vector_1.Vector.create(svgGroup3).normalizePath()).toBeInstanceOf(vector_1.Vector);
            });
            it('shoule normalize path "d" attribute', function () {
                expect(vector_1.Vector.create(svgPath).normalizePath().node.hasAttribute('d')).toBe(true);
                expect(vector_1.Vector.create(svgPath2).normalizePath().node.hasAttribute('d')).toBe(true);
                expect(vector_1.Vector.create(svgPath3).normalizePath().node.hasAttribute('d')).toBe(true);
                expect(vector_1.Vector.create(svgPath).normalizePath().attr('d')).toEqual('M 10 10');
                expect(vector_1.Vector.create(svgPath2).normalizePath().attr('d')).toEqual('M 100 100 C 100 100 0 150 100 200 Z');
                expect(vector_1.Vector.create(svgPath3).normalizePath().attr('d')).toEqual('M 0 0');
            });
            it('should only normalize SVGPathElement', function () {
                expect(vector_1.Vector.create(svgContainer).normalizePath().node.hasAttribute('d')).toBe(false);
                expect(vector_1.Vector.create(svgGroup).normalizePath().node.hasAttribute('d')).toBe(false);
                expect(vector_1.Vector.create(svgCircle).normalizePath().node.hasAttribute('d')).toBe(false);
                expect(vector_1.Vector.create(svgEllipse).normalizePath().node.hasAttribute('d')).toBe(false);
                expect(vector_1.Vector.create(svgPolygon).normalizePath().node.hasAttribute('d')).toBe(false);
                expect(vector_1.Vector.create(svgText).normalizePath().node.hasAttribute('d')).toBe(false);
                expect(vector_1.Vector.create(svgRectangle).normalizePath().node.hasAttribute('d')).toBe(false);
                expect(vector_1.Vector.create(svgGroup1).normalizePath().node.hasAttribute('d')).toBe(false);
                expect(vector_1.Vector.create(svgGroup2).normalizePath().node.hasAttribute('d')).toBe(false);
                expect(vector_1.Vector.create(svgGroup3).normalizePath().node.hasAttribute('d')).toBe(false);
            });
        });
        describe('#createSlicePathData', function () {
            it('should return the path string of a part of sector', function () {
                expect((0, path_1.createSlicePathData)(5, 10, 0, Math.PI / 2)).toBe('M10,0A10,10 0 0,1 6.123233995736766e-16,10L3.061616997868383e-16,5A5,5 0 0,0 5,0Z');
            });
        });
    });
});
//# sourceMappingURL=path.test.js.map