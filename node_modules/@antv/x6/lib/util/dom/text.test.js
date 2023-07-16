"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = require("../vector");
var text_1 = require("./text");
describe('Dom', function () {
    describe('#text', function () {
        function serializeNode(node) {
            return new XMLSerializer().serializeToString(node);
        }
        // const { wrap } = setupTest()
        // const getSvg = () => {
        //   const svg = v('svg')
        //   svg.attr('width', 600)
        //   svg.attr('height', 800)
        //   wrap.appendChild(svg.node)
        //   return svg
        // }
        // afterEach(clearnTest)
        it('should create single line text', function () {
            var t = vector_1.Vector.create('text', { x: 250, dy: 100, fill: 'black' });
            t.text('abc');
            expect(t.node.childNodes.length).toEqual(1);
            expect(t.node.childNodes[0].childNodes.length).toEqual(1);
            expect(serializeNode(t.node.childNodes[0].childNodes[0])).toEqual('abc');
        });
        it('should create multi-line text', function () {
            var t = vector_1.Vector.create('text', { x: 250, dy: 100, fill: 'black' });
            t.text('abc\ndef');
            expect(t.node.childNodes.length).toEqual(2);
            t.text('abcdefgh', {
                annotations: [
                    { start: 1, end: 3, attrs: { fill: 'red', stroke: 'orange' } },
                    { start: 2, end: 5, attrs: { fill: 'blue' } },
                ],
            });
            expect(t.find('.v-line').length).toEqual(1);
            expect(t.find('tspan').length).toEqual(4);
            t.text('abcd\nefgh', {
                annotations: [
                    { start: 1, end: 3, attrs: { fill: 'red', stroke: 'orange' } },
                    {
                        start: 2,
                        end: 5,
                        attrs: { fill: 'blue', class: 'blue-annotation' },
                    },
                ],
            });
            expect(t.find('.v-line').length).toEqual(2);
            expect(t.find('tspan').length).toEqual(5);
        });
        it('should append custom EOL', function () {
            var t = vector_1.Vector.create('text', { x: 250, dy: 100, fill: 'black' });
            t.text('abc\ndef', { eol: 'X' });
            expect(t.node.childNodes[0].textContent).toEqual('abcX');
            expect(t.node.childNodes[1].textContent).toEqual('def');
            t.text('abc\ndef\n', { eol: 'X' });
            expect(t.node.childNodes[0].textContent).toEqual('abcX');
            expect(t.node.childNodes[1].textContent).toEqual('defX');
        });
        it('should add annotations to tspan', function () {
            var t = vector_1.Vector.create('text', { x: 250, dy: 100, fill: 'black' });
            t.text('abcdefgh', {
                includeAnnotationIndices: true,
                annotations: [
                    { start: 1, end: 3, attrs: { fill: 'red', stroke: 'orange' } },
                    { start: 2, end: 5, attrs: { fill: 'blue' } },
                ],
            });
            var tspans = t.find('tspan');
            expect(tspans[1].attr('annotations')).toEqual('0');
            expect(tspans[2].attr('annotations')).toEqual('0,1');
            expect(tspans[3].attr('annotations')).toEqual('1');
        });
        it('visibility', function () {
            var t = vector_1.Vector.create('text', { x: 250, dy: 100, fill: 'black' });
            t.text('');
            expect(t.attr('display')).toEqual('none');
            t.text('text');
            expect(t.attr('display')).toBeNull();
        });
        it('vertical anchor', function () {
            var texts = ['one', 'one\ntwo', 'one\ntwo\nthree'];
            var n = texts.length;
            var fontSize = 30;
            var t = vector_1.Vector.create('text', { 'font-size': fontSize });
            for (var i = 0; i < n; i += 1) {
                var text = texts[i];
                var bbox = void 0;
                // 'bottom'
                t.text(text, { textVerticalAnchor: 'bottom' });
                bbox = t.getBBox();
                expect(bbox.getCorner().y < fontSize * 0.2).toBeTruthy();
                // 'top'
                t.text(text, { textVerticalAnchor: 'top' });
                bbox = t.getBBox();
                expect(bbox.getOrigin().y < fontSize * 0.2).toBeTruthy();
                // 'middle'
                t.text(text, { textVerticalAnchor: 'middle' });
                bbox = t.getBBox();
                expect(bbox.getCenter().y < fontSize * 0.2).toBeTruthy();
            }
        });
        it('should break the words by size', function () {
            expect((0, text_1.breakText)('aaaaabbbbbccccceeeeefffffggggghhhhh', {
                width: 200,
                height: 400,
            }).split('\n').length).toBe(2);
            expect((0, text_1.breakText)('aaaaabbbbbccccceeeeefffffggggghhhhh', {
                width: 200,
                height: 20,
            }).split('\n').length).toBe(1);
        });
    });
});
//# sourceMappingURL=text.test.js.map