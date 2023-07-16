"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var geometry_1 = require("../../geometry");
var vector_1 = require("../vector");
var elem_test_1 = require("./elem.test");
var geom_1 = require("./geom");
describe('Dom', function () {
    describe('geom', function () {
        var _a = (0, elem_test_1.setupTest)(), svgContainer = _a.svgContainer, svgGroup = _a.svgGroup, svgGroup1 = _a.svgGroup1, svgCircle = _a.svgCircle, svgLinearGradient = _a.svgLinearGradient, svgEllipse = _a.svgEllipse, svgPolygon = _a.svgPolygon, svgRectangle = _a.svgRectangle, svgPath = _a.svgPath, foreignDiv = _a.foreignDiv;
        afterEach(elem_test_1.clearnTest);
        describe('#bbox', function () {
            it('should return a rectangle instance', function () {
                expect(vector_1.Vector.create('circle').bbox()).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgCircle).bbox()).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgCircle).bbox(true)).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgCircle).bbox(true, svgGroup1)).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgLinearGradient).bbox()).toBeInstanceOf(geometry_1.Rectangle);
            });
        });
        describe('#getBBox', function () {
            it('should return a rectangle instance', function () {
                expect(vector_1.Vector.create('circle').getBBox()).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgCircle).getBBox()).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgCircle).getBBox({})).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgLinearGradient).getBBox()).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgCircle).getBBox({ recursive: true })).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgGroup).getBBox({ recursive: true })).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgGroup).getBBox({ target: svgContainer })).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgGroup).getBBox({ target: svgCircle })).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgGroup1).getBBox({ recursive: true })).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgGroup1).getBBox({ target: svgContainer })).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgGroup1).getBBox({ target: svgCircle })).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgLinearGradient).getBBox({ recursive: true })).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgLinearGradient).getBBox({
                    target: svgContainer,
                })).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgLinearGradient).getBBox({ target: svgCircle })).toBeInstanceOf(geometry_1.Rectangle);
                expect((0, geom_1.getBBox)(foreignDiv)).toBeInstanceOf(geometry_1.Rectangle);
            });
        });
        describe('#toLocalPoint', function () {
            it('convert absolute coordinates to coordinates relative to svgContainer', function () {
                var _a = svgContainer.getBoundingClientRect(), x = _a.x, y = _a.y;
                var _b = vector_1.Vector.create(svgContainer).toLocalPoint(x, y), localX = _b.x, localY = _b.y;
                expect(localX).toBe(0);
                expect(localY).toBe(0);
            });
        });
        describe('#toGeometryShape', function () {
            it('convert the SVGElement to an equivalent geometric shap', function () {
                expect(vector_1.Vector.create(svgEllipse).toGeometryShape()).toBeInstanceOf(geometry_1.Ellipse);
                expect(vector_1.Vector.create(svgCircle).toGeometryShape()).toBeInstanceOf(geometry_1.Ellipse);
                expect(vector_1.Vector.create(svgPolygon).toGeometryShape()).toBeInstanceOf(geometry_1.Polyline);
                expect(vector_1.Vector.create(svgRectangle).toGeometryShape()).toBeInstanceOf(geometry_1.Rectangle);
                expect(vector_1.Vector.create(svgPath).toGeometryShape()).toBeInstanceOf(geometry_1.Path);
                expect(vector_1.Vector.create(svgGroup).toGeometryShape()).toBeInstanceOf(geometry_1.Rectangle);
            });
        });
        describe('#animateAlongPath', function () {
            it('should not throw error', function () {
                var result = true;
                try {
                    vector_1.Vector.create(svgEllipse).animateAlongPath({}, svgPath);
                }
                catch (e) {
                    result = false;
                }
                expect(result).toBeTruthy();
            });
        });
    });
});
//# sourceMappingURL=geom.test.js.map