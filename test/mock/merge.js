"use strict";

var Q = require("q-util");
var FS = require("q-fs");
var Root = require("q-fs/root").Fs;
var MOCK = require("q-fs/mock");
var ASSERT = require("assert");

var Mock = MOCK.Fs;
var merge = MOCK.merge;

exports['test merge'] = function (ASSERT, done) {

    var merged = merge([
        Mock({
            "a": 10,
            "b": 20,
            "1/2/3": "123"
        }),
        Mock({
            "a": 20,
            "c": 30
        }),
        Mock({
            "a": 30,
            "d": 40
        }),
    ])

    Q.when(merged, function (merged) {
        return Q.when(merged.listTree(), function (list) {
            ASSERT.deepEqual(list.sort(), [
                ".", "a", "b", "c", "d", "1", "1/2", "1/2/3"
            ].sort(), 'listTree');
        }).then(function () {
            return Q.when(merged.read("a", "rb"), function (a) {
                ASSERT.deepEqual(a, 30, 'read overridden');
            });
        }).then(function () {
            return Q.when(merged.read("b", "rb"), function (a) {
                ASSERT.deepEqual(a, 20, 'read non-overridden');
            });
        });
    })
    .then(null, Q.error).then(done);

};

if (require.main === module) {
    require("test").run(exports);
}


