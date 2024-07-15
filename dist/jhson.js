"use strict";

var Is;

(n => {
    function t(n) {
        return n !== null && n !== void 0 && n.toString() !== "";
    }
    n.defined = t;
    function e(n) {
        return t(n) && typeof n === "object";
    }
    n.definedObject = e;
    function o(n) {
        return t(n) && typeof n === "boolean";
    }
    n.definedBoolean = o;
    function r(n) {
        return t(n) && typeof n === "string";
    }
    n.definedString = r;
    function i(n) {
        return t(n) && typeof n === "function";
    }
    n.definedFunction = i;
    function u(n) {
        return t(n) && typeof n === "number";
    }
    n.definedNumber = u;
    function c(n) {
        return e(n) && n instanceof Array;
    }
    n.definedArray = c;
})(Is || (Is = {}));

(() => {
    let _configuration = {};
    function fireCustomTriggerEvent(n, ...t) {
        if (Is.definedFunction(n)) {
            n.apply(null, [].slice.call(t, 0));
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
            } catch (n) {
                if (!_configuration.safeMode) {
                    console.error(_configuration.text.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", n.message));
                    result.parsed = false;
                }
                result.object = null;
            }
        }
        return result;
    }
    const _public = {
        json: function() {
            const n = {
                includeAttributes: function(n) {
                    throw new Error("Function not implemented.");
                },
                includeCssProperties: function(n) {
                    throw new Error("Function not implemented.");
                },
                includeText: function(n) {
                    throw new Error("Function not implemented.");
                },
                includeChildren: function(n) {
                    throw new Error("Function not implemented.");
                },
                friendlyFormat: function(n) {
                    throw new Error("Function not implemented.");
                },
                indentSpaces: function(n) {
                    throw new Error("Function not implemented.");
                },
                ignoreNodeTypes: function(n) {
                    throw new Error("Function not implemented.");
                },
                ignoreCssProperties: function(n) {
                    throw new Error("Function not implemented.");
                },
                ignoreAttributes: function(n) {
                    throw new Error("Function not implemented.");
                },
                generateUniqueMissingIds: function(n) {
                    throw new Error("Function not implemented.");
                },
                get: function(n) {
                    throw new Error("Function not implemented.");
                },
                getVariables: function(n) {
                    throw new Error("Function not implemented.");
                }
            };
            return n;
        },
        html: function() {
            const n = {
                json: function(n) {
                    throw new Error("Function not implemented.");
                },
                templateData: function(n) {
                    throw new Error("Function not implemented.");
                },
                removeOriginalAttributes: function(n) {
                    throw new Error("Function not implemented.");
                },
                clearOriginalHTML: function(n) {
                    throw new Error("Function not implemented.");
                },
                addCssToHead: function(n) {
                    throw new Error("Function not implemented.");
                },
                clearCssFromHead: function(n) {
                    throw new Error("Function not implemented.");
                },
                logTemplateDataWarnings: function(n) {
                    throw new Error("Function not implemented.");
                },
                addAttributes: function(n) {
                    throw new Error("Function not implemented.");
                },
                addCssProperties: function(n) {
                    throw new Error("Function not implemented.");
                },
                addText: function(n) {
                    throw new Error("Function not implemented.");
                },
                addChildren: function(n) {
                    throw new Error("Function not implemented.");
                },
                write: function(n) {
                    throw new Error("Function not implemented.");
                },
                getVariables: function(n) {
                    throw new Error("Function not implemented.");
                }
            };
            return n;
        },
        setConfiguration: function(n) {
            throw new Error("Function not implemented.");
        },
        getVersion: function() {
            throw new Error("Function not implemented.");
        }
    };
    (() => {})();
})();//# sourceMappingURL=jhson.js.map