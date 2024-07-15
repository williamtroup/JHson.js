"use strict";

var Is;

(e => {
    function t(e) {
        return e !== null && e !== void 0 && e.toString() !== "";
    }
    e.defined = t;
    function n(e) {
        return t(e) && typeof e === "object";
    }
    e.definedObject = n;
    function r(e) {
        return t(e) && typeof e === "boolean";
    }
    e.definedBoolean = r;
    function o(e) {
        return t(e) && typeof e === "string";
    }
    e.definedString = o;
    function i(e) {
        return t(e) && typeof e === "function";
    }
    e.definedFunction = i;
    function c(e) {
        return t(e) && typeof e === "number";
    }
    e.definedNumber = c;
    function u(e) {
        return n(e) && e instanceof Array;
    }
    e.definedArray = u;
})(Is || (Is = {}));

(() => {
    let _configuration = {};
    function fireCustomTriggerEvent(e, ...t) {
        if (Is.definedFunction(e)) {
            e.apply(null, [].slice.call(t, 0));
        }
    }
    function getObjectFromString(objectString) {
        const result = {
            parsed: true,
            object: null
        };
        try {
            if (Is.definedString(objectString)) {
                result.object = JSON.parse(objectString);
            }
        } catch (e1) {
            try {
                result.object = eval(`(${objectString})`);
                if (Is.definedFunction(result.object)) {
                    result.object = result.object();
                }
            } catch (e) {
                if (!_configuration.safeMode) {
                    console.error(_configuration.text.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", e.message));
                    result.parsed = false;
                }
                result.object = null;
            }
        }
        return result;
    }
    (() => {})();
})();//# sourceMappingURL=jhson.js.map