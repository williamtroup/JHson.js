var __getOwnPropNames = Object.getOwnPropertyNames;

var __esm = (e, t) => function r() {
    return e && (t = (0, e[__getOwnPropNames(e)[0]])(e = 0)), t;
};

var __commonJS = (e, t) => function r() {
    return t || (0, e[__getOwnPropNames(e)[0]])((t = {
        exports: {}
    }).exports, t), t.exports;
};

var init_enum = __esm({
    "src/ts/enum.ts"() {
        "use strict";
    }
});

var Is;

var init_is = __esm({
    "src/ts/is.ts"() {
        "use strict";
        init_enum();
        (e => {
            function t(e) {
                return e !== null && e !== void 0 && e.toString() !== "";
            }
            e.defined = t;
            function r(e) {
                return t(e) && typeof e === "object";
            }
            e.definedObject = r;
            function n(e) {
                return t(e) && typeof e === "boolean";
            }
            e.definedBoolean = n;
            function o(e) {
                return t(e) && typeof e === "string";
            }
            e.definedString = o;
            function i(e) {
                return t(e) && typeof e === "function";
            }
            e.definedFunction = i;
            function s(e) {
                return t(e) && typeof e === "number";
            }
            e.definedNumber = s;
            function u(e) {
                return r(e) && e instanceof Array;
            }
            e.definedArray = u;
        })(Is || (Is = {}));
    }
});

var require_jhson = __commonJS({
    "src/jhson.ts"(exports, module) {
        init_is();
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
        })();
    }
});

export default require_jhson();//# sourceMappingURL=jhson.esm.js.map