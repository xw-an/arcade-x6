"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var sinon_1 = __importDefault(require("sinon"));
var index_1 = require("./index");
describe('DataUri', function () {
    describe('#isDataUrl', function () {
        it('should return true with dataurl', function () {
            expect(index_1.DataUri.isDataUrl('data:image')).toBeTruthy();
        });
        it('should return false with invalid dataurl', function () {
            expect(index_1.DataUri.isDataUrl('abc')).toBeFalsy();
        });
    });
    describe('#imageToDataUri', function () {
        var oldXMLHttpRequest = window.XMLHttpRequest;
        var oldFileReader = window.FileReader;
        var onLoadHandle;
        var onErrorHandle;
        beforeEach(function () {
            var win = window;
            win.FileReader = null;
            win.XMLHttpRequest = sinon_1.default.spy(function () { return ({
                open: sinon_1.default.spy(),
                send: sinon_1.default.spy(),
                readyState: 4,
                status: 200,
                response: 10,
                addEventListener: function (name, handle) {
                    if (name === 'load') {
                        onLoadHandle = handle;
                    }
                    if (name === 'error') {
                        onErrorHandle = handle;
                    }
                },
            }); });
        });
        afterEach(function () {
            window.XMLHttpRequest = oldXMLHttpRequest;
            window.FileReader = oldFileReader;
        });
        it('should run setTimeout with dataurl', function (done) {
            var spy = sinon_1.default.spy();
            index_1.DataUri.imageToDataUri('data:image', spy);
            setTimeout(function () {
                expect(spy.callCount).toBe(1);
                done();
            }, 10);
        });
        it('should return datauri with image loaded', function () {
            var spy = sinon_1.default.spy();
            index_1.DataUri.imageToDataUri('test.svg', spy);
            onLoadHandle();
            expect(spy.callCount).toBe(1);
            expect(spy.firstCall.args[1]).toEqual('data:image/svg+xml;base64,AAAAAAAAAAAAAA==');
        });
        it('should return datauri with image load error', function () {
            var spy = sinon_1.default.spy();
            index_1.DataUri.imageToDataUri('test.svg', spy);
            onErrorHandle();
            expect(spy.callCount).toBe(1);
            expect(spy.firstCall.args[0]).toEqual(new Error("Failed to load image: test.svg"));
        });
    });
    describe('#dataUriToBlob', function () {
        it('should return correct blob data with base64 datauri', function () {
            var blob = index_1.DataUri.dataUriToBlob('data:image/svg+xml;base64,AAAAAAAAAAAAAGFiY2RlZmc=');
            expect(blob.type).toBe('image/svg+xml');
        });
        it('should return correct blob data with datauri', function () {
            var blob = index_1.DataUri.dataUriToBlob('data:image/svg+xml,AAAAAAAAAAAAAGFiY2RlZmc=');
            expect(blob.type).toBe('image/svg+xml');
        });
    });
    describe('#svgToDataUrl', function () {
        it('should return dataurl of a svg string', function () {
            expect(index_1.DataUri.svgToDataUrl('<svg width="100" height="100"></svg>', {
                width: 100,
                height: 100,
            })).toBe('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%3E%3C%2Fsvg%3E');
        });
        it('should return dataurl of a svg string without option', function () {
            expect(index_1.DataUri.svgToDataUrl('<svg width="100" height="100"></svg>')).toBe('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%3E%3C%2Fsvg%3E');
            expect(index_1.DataUri.svgToDataUrl('<svg viewBox="0 0 100 100"></svg>')).toBe('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20100%20100%22%3E%3C%2Fsvg%3E');
        });
        it('should throw error when no width or no height', function () {
            expect(function () {
                index_1.DataUri.svgToDataUrl('<svg></svg>');
            }).toThrowError('Can not parse width from svg string');
            expect(function () {
                index_1.DataUri.svgToDataUrl('<svg width="100"></svg>');
            }).toThrowError('Can not parse height from svg string');
        });
    });
});
//# sourceMappingURL=index.test.js.map