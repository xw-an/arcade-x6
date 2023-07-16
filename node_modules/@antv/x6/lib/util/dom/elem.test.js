"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearnTest = exports.setupTest = void 0;
var vector_1 = require("../vector");
var elem_1 = require("./elem");
var wrap = document.createElement('div');
var svgContent = '<path id="svg-path" d="M10 10"/>' +
    '<!-- comment -->' +
    '<g id="svg-group">' +
    '  <ellipse id="svg-ellipse" x="10" y="10" rx="30" ry="30"/>' +
    '  <circle id="svg-circle" cx="10" cy="10" r="2" fill="red"/>' +
    '</g>' +
    '<polygon id="svg-polygon" points="200,10 250,190 160,210"/>' +
    '<text id="svg-text" x="0" y="15" fill="red">Test</text>' +
    '<rect id="svg-rectangle" x="100" y="100" width="50" height="100"/>' +
    '<g id="svg-group-1" class="group-1">' +
    '  <g id="svg-group-2" class="group-2">' +
    '    <g id="svg-group-3" class="group3">' +
    '      <path id="svg-path-2" d="M 100 100 C 100 100 0 150 100 200 Z"/>' +
    '    </g>' +
    '  </g>' +
    '</g>' +
    '<path id="svg-path-3"/>' +
    '<linearGradient id= "svg-linear-gradient"><stop/></linearGradient>' +
    '<foreignObject x="20" y="20" width="160" height="160">' +
    '<body xmlns="http://www.w3.org/1999/xhtml">' +
    '<div id="foreign-div"></div>' +
    '</body>' +
    '</foreignObject>';
vector_1.Vector.create('svg', { id: 'svg-container' }, vector_1.Vector.createVectors(svgContent)).appendTo(wrap);
function setupTest() {
    document.body.appendChild(wrap);
    var byId = function (id) { return document.getElementById(id); };
    return {
        wrap: wrap,
        svgContainer: byId('svg-container'),
        svgDefs: byId('svg-defs'),
        svgPath: byId('svg-path'),
        svgGroup: byId('svg-group'),
        svgCircle: byId('svg-circle'),
        svgEllipse: byId('svg-ellipse'),
        svgPolygon: byId('svg-polygon'),
        svgText: byId('svg-text'),
        svgRectangle: byId('svg-rectangle'),
        svgGroup1: byId('svg-group-1'),
        svgGroup2: byId('svg-group-2'),
        svgGroup3: byId('svg-group-3'),
        svgPath2: byId('svg-path-2'),
        svgPath3: byId('svg-path-3'),
        svgLinearGradient: byId('svg-linear-gradient'),
        foreignDiv: byId('foreign-div'),
    };
}
exports.setupTest = setupTest;
function clearnTest() {
    (0, elem_1.remove)(wrap);
}
exports.clearnTest = clearnTest;
describe('Dom', function () {
    describe('elem', function () {
        var childrenTagNames = function (vel) {
            var tagNames = [];
            vel.node.childNodes.forEach(function (childNode) {
                tagNames.push(childNode.tagName.toLowerCase());
            });
            return tagNames;
        };
        var _a = setupTest(), svgContainer = _a.svgContainer, svgPath = _a.svgPath, svgGroup = _a.svgGroup, svgCircle = _a.svgCircle, svgEllipse = _a.svgEllipse, svgPolygon = _a.svgPolygon, svgText = _a.svgText, svgRectangle = _a.svgRectangle, svgGroup1 = _a.svgGroup1, svgGroup2 = _a.svgGroup2, svgGroup3 = _a.svgGroup3, svgPath2 = _a.svgPath2, svgPath3 = _a.svgPath3, svgLinearGradient = _a.svgLinearGradient;
        afterAll(function () { return clearnTest(); });
        describe('#ensureId', function () {
            it('should set a id when id is empty', function () {
                var node = document.createElement('g');
                expect(node.id).toBe('');
                var id = (0, elem_1.ensureId)(node);
                expect(node.id).toEqual(id);
            });
            it('should not overwrite if id exited', function () {
                var node = document.createElement('g');
                expect(node.id).toBe('');
                var id = (0, elem_1.ensureId)(node);
                expect(node.id).toEqual(id);
                expect((0, elem_1.ensureId)(node)).toEqual(id);
            });
        });
        describe('id', function () {
            it('should auto generate id', function () {
                var vel = vector_1.Vector.create('rect');
                expect(vel.id).not.toBeNull();
                expect(vel.id).toEqual(vel.node.id);
            });
            it('should set id for node', function () {
                var vel = vector_1.Vector.create('rect');
                vel.id = 'xxx';
                expect(vel.id).toEqual('xxx');
                expect(vel.id).toEqual(vel.node.id);
            });
        });
        describe('#isSVGGraphicsElement', function () {
            it('should return true when the given element is a SVGGraphicsElement', function () {
                expect((0, elem_1.isSVGGraphicsElement)(vector_1.Vector.create('circle').node)).toBe(true);
                expect((0, elem_1.isSVGGraphicsElement)(vector_1.Vector.create('rect').node)).toBe(true);
                expect((0, elem_1.isSVGGraphicsElement)(vector_1.Vector.create('path').node)).toBe(true);
            });
            it('should return false when the given element is not a SVGGraphicsElement', function () {
                expect((0, elem_1.isSVGGraphicsElement)()).toBe(false);
                expect((0, elem_1.isSVGGraphicsElement)(vector_1.Vector.create('linearGradient').node)).toBe(false);
            });
        });
        describe('#index', function () {
            it('should return 0 for the first child', function () {
                expect(vector_1.Vector.create(svgContainer).index()).toEqual(0);
                expect(vector_1.Vector.create(svgPath).index()).toEqual(0);
            });
            it('should return correct index of children', function () {
                expect(vector_1.Vector.create(svgPath).index()).toEqual(0);
                expect(vector_1.Vector.create(svgGroup).index()).toEqual(1);
                expect(vector_1.Vector.create(svgPolygon).index()).toEqual(2);
                expect(vector_1.Vector.create(svgText).index()).toEqual(3);
                expect(vector_1.Vector.create(svgRectangle).index()).toEqual(4);
                expect(vector_1.Vector.create(svgEllipse).index()).toEqual(0);
                expect(vector_1.Vector.create(svgCircle).index()).toEqual(1);
            });
        });
        describe('#tagName', function () {
            it('should return the correct tagName with lowercase', function () {
                expect(vector_1.Vector.create(svgContainer).tagName()).toEqual('svg');
                expect(vector_1.Vector.create(svgPath).tagName()).toEqual('path');
                expect(vector_1.Vector.create(svgGroup).tagName()).toEqual('g');
                expect(vector_1.Vector.create(svgCircle).tagName()).toEqual('circle');
                expect(vector_1.Vector.create(svgEllipse).tagName()).toEqual('ellipse');
                expect(vector_1.Vector.create(svgPolygon).tagName()).toEqual('polygon');
                expect(vector_1.Vector.create(svgText).tagName()).toEqual('text');
                expect(vector_1.Vector.create(svgRectangle).tagName()).toEqual('rect');
                expect(vector_1.Vector.create(svgGroup1).tagName()).toEqual('g');
                expect(vector_1.Vector.create(svgGroup2).tagName()).toEqual('g');
                expect(vector_1.Vector.create(svgGroup3).tagName()).toEqual('g');
                expect(vector_1.Vector.create(svgPath2).tagName()).toEqual('path');
                expect(vector_1.Vector.create(svgPath3).tagName()).toEqual('path');
                expect(vector_1.Vector.create(svgLinearGradient).tagName()).toEqual('lineargradient');
            });
            it('should return uppercase tagName when specified', function () {
                expect((0, elem_1.tagName)(svgContainer, false)).toEqual('SVG');
            });
        });
        describe('#find', function () {
            it('should return an array of vectors', function () {
                var container = vector_1.Vector.create(svgContainer);
                var found = container.find('circle');
                expect(found).toBeInstanceOf(Array);
                expect(found.length > 0).toBeTruthy();
                expect(found.every(function (f) { return f instanceof vector_1.Vector; })).toBe(true);
            });
        });
        describe('#findOne', function () {
            it('should return the first found vector', function () {
                var container = vector_1.Vector.create(svgContainer);
                var found = container.findOne('circle');
                expect(found).toBeInstanceOf(vector_1.Vector);
                expect(found.id).toEqual('svg-circle');
            });
        });
        describe('#findParentByClass', function () {
            it('should return parent vector if exists', function () {
                var found = vector_1.Vector.create(svgGroup3).findParentByClass('group-1');
                expect(found != null && found.node === svgGroup1).toBe(true);
            });
            it('should return null if none parent matched', function () {
                var found = vector_1.Vector.create(svgGroup3).findParentByClass('not-a-parent');
                expect(found == null).toBe(true);
            });
            it('should stopped early', function () {
                var found1 = vector_1.Vector.create(svgGroup3).findParentByClass('group-1', svgGroup2);
                expect(found1 == null).toBe(true);
                var found2 = vector_1.Vector.create(svgGroup3).findParentByClass('group-1', svgCircle);
                expect(found2 != null && found2.node === svgGroup1).toBe(true);
            });
        });
        describe('#contains', function () {
            it('...', function () {
                expect(vector_1.Vector.create(svgContainer).contains(svgGroup1)).toBe(true);
                expect(vector_1.Vector.create(svgGroup1).contains(svgGroup2)).toBe(true);
                expect(vector_1.Vector.create(svgGroup1).contains(svgGroup3)).toBe(true);
                expect(vector_1.Vector.create(svgGroup3).contains(svgGroup1)).toBe(false);
                expect(vector_1.Vector.create(svgGroup2).contains(svgGroup1)).toBe(false);
                expect(vector_1.Vector.create(svgGroup1).contains(svgGroup1)).toBe(false);
                expect(vector_1.Vector.create(svgGroup1).contains(document)).toBe(false);
            });
        });
        describe('#empty', function () {
            var vel = vector_1.Vector.create('g');
            beforeEach(function () { return vector_1.Vector.create(svgContainer).append(vel); });
            afterEach(function () { return vel.remove(); });
            it('should remove all child nodes', function () {
                vel.append([
                    vector_1.Vector.create('rect'),
                    vector_1.Vector.create('polygon'),
                    vector_1.Vector.create('circle'),
                ]);
                expect(vel.node.childNodes.length).toEqual(3);
                vel.empty();
                expect(vel.node.childNodes.length).toEqual(0);
            });
        });
        describe('#append', function () {
            var group = vector_1.Vector.create((0, elem_1.createElement)('g'));
            beforeEach(function () { return group.empty(); });
            it('should append single element', function () {
                group.append(vector_1.Vector.create('<rect/>'));
                expect(group.node.childNodes.length).toEqual(1);
                expect(childrenTagNames(group)).toEqual(['rect']);
            });
            it('should append multiple elements', function () {
                group.append(vector_1.Vector.createVectors('<rect/><circle/>'));
                expect(group.node.childNodes.length).toEqual(2);
                expect(childrenTagNames(group)).toEqual(['rect', 'circle']);
                group.append(vector_1.Vector.createVectors('<line/><polygon/>'));
                expect(group.node.childNodes.length).toEqual(4);
                expect(childrenTagNames(group)).toEqual([
                    'rect',
                    'circle',
                    'line',
                    'polygon',
                ]);
            });
        });
        describe('#prepend', function () {
            var group;
            beforeEach(function () {
                group = vector_1.Vector.create(svgGroup).clone().empty().appendTo(svgContainer);
            });
            afterAll(function () { return group.remove(); });
            it('should prepend single element', function () {
                group.prepend(vector_1.Vector.create('<rect/>'));
                expect(group.node.childNodes.length).toEqual(1);
                expect(childrenTagNames(group)).toEqual(['rect']);
            });
            it('should prepend multiple elements', function () {
                group.prepend(vector_1.Vector.createVectors('<rect/><circle/>'));
                expect(group.node.childNodes.length).toEqual(2);
                expect(childrenTagNames(group)).toEqual(['rect', 'circle']);
                group.prepend(vector_1.Vector.createVectors('<line/><polygon/>'));
                expect(group.node.childNodes.length).toEqual(4);
                expect(childrenTagNames(group)).toEqual([
                    'line',
                    'polygon',
                    'rect',
                    'circle',
                ]);
            });
        });
        describe('#before', function () {
            var group;
            var rect;
            beforeEach(function () {
                group = vector_1.Vector.create(svgGroup).clone().empty();
                rect = vector_1.Vector.create(svgRectangle).clone().empty();
                group.append(rect);
            });
            afterAll(function () { return group.remove(); });
            it('should add single element', function () {
                rect.before(vector_1.Vector.create('<circle/>'));
                expect(group.node.childNodes.length).toEqual(2);
                expect(childrenTagNames(group)).toEqual(['circle', 'rect']);
                rect.before(vector_1.Vector.create('<line/>'));
                expect(group.node.childNodes.length).toEqual(3);
                expect(childrenTagNames(group)).toEqual(['circle', 'line', 'rect']);
            });
            it('should add multiple elements', function () {
                rect.before(vector_1.Vector.createVectors('<ellipse/><circle/>'));
                expect(group.node.childNodes.length).toEqual(3);
                expect(childrenTagNames(group)).toEqual(['ellipse', 'circle', 'rect']);
                rect.before(vector_1.Vector.createVectors('<line/><polygon/>'));
                expect(group.node.childNodes.length).toEqual(5);
                expect(childrenTagNames(group)).toEqual([
                    'ellipse',
                    'circle',
                    'line',
                    'polygon',
                    'rect',
                ]);
            });
        });
        describe('#children', function () {
            it('should return a array for vectors', function () {
                var children = vector_1.Vector.create(svgGroup).children();
                expect(children).toBeInstanceOf(Array);
                expect(children.every(function (c) { return c instanceof vector_1.Vector; })).toEqual(true);
            });
        });
    });
});
//# sourceMappingURL=elem.test.js.map