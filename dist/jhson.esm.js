var Constant;

(e => {
    e.JHSON_JS_ATTRIBUTE_NAME = "data-jhson-js";
})(Constant || (Constant = {}));

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
    function i(e) {
        return t(e) && typeof e === "string";
    }
    e.definedString = i;
    function a(e) {
        return t(e) && typeof e === "function";
    }
    e.definedFunction = a;
    function o(e) {
        return t(e) && typeof e === "number";
    }
    e.definedNumber = o;
    function s(e) {
        return n(e) && e instanceof Array;
    }
    e.definedArray = s;
})(Is || (Is = {}));

var Default2;

(Default => {
    function getAnyString(e, t) {
        return typeof e === "string" ? e : t;
    }
    Default.getAnyString = getAnyString;
    function getString(e, t) {
        return Is.definedString(e) ? e : t;
    }
    Default.getString = getString;
    function getBoolean(e, t) {
        return Is.definedBoolean(e) ? e : t;
    }
    Default.getBoolean = getBoolean;
    function getNumber(e, t) {
        return Is.definedNumber(e) ? e : t;
    }
    Default.getNumber = getNumber;
    function getFunction(e, t) {
        return Is.definedFunction(e) ? e : t;
    }
    Default.getFunction = getFunction;
    function getArray(e, t) {
        return Is.definedArray(e) ? e : t;
    }
    Default.getArray = getArray;
    function getObject(e, t) {
        return Is.definedObject(e) ? e : t;
    }
    Default.getObject = getObject;
    function getStringOrArray(e, t) {
        let n = t;
        if (Is.definedString(e)) {
            const r = e.toString().split(" ");
            if (r.length === 0) {
                e = t;
            } else {
                n = r;
            }
        } else {
            n = getArray(e, t);
        }
        return n;
    }
    Default.getStringOrArray = getStringOrArray;
    function getObjectFromString(objectString, configuration) {
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
                if (!configuration.safeMode) {
                    console.error(configuration.text.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", e.message));
                    result.parsed = false;
                }
                result.object = null;
            }
        }
        return result;
    }
    Default.getObjectFromString = getObjectFromString;
})(Default2 || (Default2 = {}));

var DomElement;

(e => {
    function t(e, t) {
        const n = t.toLowerCase();
        const r = n === "text";
        let i = r ? document.createTextNode("") : document.createElement(n);
        e.appendChild(i);
        return i;
    }
    e.create = t;
})(DomElement || (DomElement = {}));

var Str;

(e => {
    function t(e, t) {
        return e.substring(0, t.length).toLowerCase() === t.toLowerCase();
    }
    e.startsWithAnyCase = t;
    function n(e, t, n) {
        return e.replace(new RegExp(t.replace("|", `[${"|"}]`), "g"), n);
    }
    e.replaceAll = n;
    function r(e) {
        const t = [];
        if (Is.definedString(e)) {
            let n = 0;
            let r = 0;
            while (n > -1) {
                n = e.indexOf("{{", r);
                if (n > -1) {
                    r = e.indexOf("}}", n);
                    if (r > -1) {
                        const i = e.substring(n, r + "}}".length);
                        t.push(i);
                        r += 2;
                    }
                }
            }
        }
        return t;
    }
    e.getTemplateVariables = r;
})(Str || (Str = {}));

var Config;

(e => {
    let t;
    (e => {
        function t(e = null) {
            let t = Default2.getObject(e, {});
            t.safeMode = Default2.getBoolean(t.safeMode, true);
            t.domElementTypes = Default2.getStringOrArray(t.domElementTypes, [ "*" ]);
            t.formattingNodeTypes = Default2.getStringOrArray(t.formattingNodeTypes, [ "b", "strong", "i", "em", "mark", "small", "del", "ins", "sub", "sup" ]);
            t = n(t);
            return t;
        }
        e.get = t;
        function n(e) {
            e.text = Default2.getObject(e.text, {});
            e.text.variableWarningText = Default2.getString(e.text.variableWarningText, "Template variable {{variable_name}} not found.");
            e.text.objectErrorText = Default2.getString(e.text.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
            e.text.attributeNotValidErrorText = Default2.getString(e.text.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
            e.text.attributeNotSetErrorText = Default2.getString(e.text.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
            return e;
        }
    })(t = e.Options || (e.Options = {}));
})(Config || (Config = {}));

var Binding;

(e => {
    let t;
    (e => {
        function t(e, t, r) {
            const i = n(e, r);
            i._currentView = {};
            i._currentView.element = t;
            return i;
        }
        e.getForNewInstance = t;
        function n(e, t) {
            let n = Default2.getObject(e, {});
            n.json = Default2.getString(n.json, t.json);
            n.templateData = Default2.getObject(n.templateData, t.templateData);
            n.removeOriginalAttributes = Default2.getBoolean(n.removeOriginalAttributes, t.removeOriginalAttributes);
            n.clearOriginalHTML = Default2.getBoolean(n.clearOriginalHTML, t.clearOriginalHTML);
            n.addCssToHead = Default2.getBoolean(n.addCssToHead, t.addCssToHead);
            n.clearCssFromHead = Default2.getBoolean(n.clearCssFromHead, t.clearCssFromHead);
            n.logTemplateDataWarnings = Default2.getBoolean(n.logTemplateDataWarnings, t.logTemplateDataWarnings);
            n.addAttributes = Default2.getBoolean(n.addAttributes, t.addAttributes);
            n.addCssProperties = Default2.getBoolean(n.addCssProperties, t.addCssProperties);
            n.addText = Default2.getBoolean(n.addText, t.addText);
            n.addChildren = Default2.getBoolean(n.addChildren, t.addChildren);
            n = r(n);
            return n;
        }
        e.get = n;
        function r(e) {
            e.events = Default2.getObject(e.events, {});
            e.events.onBeforeRender = Default2.getFunction(e.events.onBeforeRender, null);
            e.events.onRenderComplete = Default2.getFunction(e.events.onRenderComplete, null);
            return e;
        }
    })(t = e.Options || (e.Options = {}));
})(Binding || (Binding = {}));

var Trigger;

(e => {
    function t(e, ...t) {
        if (Is.definedFunction(e)) {
            e.apply(null, [].slice.call(t, 0));
        }
    }
    e.customEvent = t;
})(Trigger || (Trigger = {}));

(() => {
    let e = {};
    function t() {
        const t = e.domElementTypes;
        const r = t.length;
        for (let e = 0; e < r; e++) {
            const r = document.getElementsByTagName(t[e]);
            const i = [].slice.call(r);
            const a = i.length;
            for (let e = 0; e < a; e++) {
                if (!n(i[e])) {
                    break;
                }
            }
        }
    }
    function n(t) {
        let n = true;
        if (Is.defined(t) && t.hasAttribute(Constant.JHSON_JS_ATTRIBUTE_NAME)) {
            let i = t.getAttribute(Constant.JHSON_JS_ATTRIBUTE_NAME);
            if (Is.definedString(i)) {
                const a = Default2.getObjectFromString(i, e);
                if (a.parsed && Is.definedObject(a.object)) {
                    r(Binding.Options.getForNewInstance(a.object, t, c()));
                } else {
                    if (!e.safeMode) {
                        console.error(e.text.attributeNotValidErrorText.replace("{{attribute_name}}", Constant.JHSON_JS_ATTRIBUTE_NAME));
                        n = false;
                    }
                }
            } else {
                if (!e.safeMode) {
                    console.error(e.text.attributeNotSetErrorText.replace("{{attribute_name}}", Constant.JHSON_JS_ATTRIBUTE_NAME));
                    n = false;
                }
            }
        }
        return n;
    }
    function r(e) {
        Trigger.customEvent(e.events.onBeforeRender, e._currentView.element);
        const t = c();
        t.json = e.json;
        g(e._currentView.element, t);
        Trigger.customEvent(e.events.onRenderComplete, e._currentView.element);
    }
    function i() {
        return {
            includeAttributes: true,
            includeCssProperties: false,
            includeText: true,
            includeChildren: true,
            friendlyFormat: true,
            indentSpaces: 2,
            ignoreNodeTypes: [],
            ignoreCssProperties: [],
            ignoreAttributes: [],
            generateUniqueMissingIds: false
        };
    }
    function a(e, t) {
        let n = "";
        if (Is.definedObject(e)) {
            const r = {};
            const i = o(e, t, {});
            r[i.nodeName] = i.nodeValues;
            if (t.friendlyFormat) {
                n = JSON.stringify(r, null, t.indentSpaces);
            } else {
                n = JSON.stringify(r);
            }
        }
        return n;
    }
    function o(e, t, n) {
        const r = {};
        const i = e.children.length;
        let a = 0;
        if (t.includeAttributes) {
            s(e, r, t);
        }
        if (t.includeCssProperties) {
            l(e, r, t, n);
        }
        if (t.includeChildren && i > 0) {
            a = u(e, r, i, t, n);
        }
        if (t.includeText) {
            d(e, r, a);
        }
        if (r.hasOwnProperty("&children") && r["&children"].length === 0) {
            delete r["&children"];
        }
        return {
            nodeName: e.nodeName.toLowerCase(),
            nodeValues: r
        };
    }
    function s(e, t, n) {
        const r = e.attributes.length;
        const i = [];
        if (n.includeText && e.nodeName.toLowerCase() === "textarea") {
            const n = e;
            if (Is.defined(n.value)) {
                t["#text"] = n.value;
            }
        }
        for (let a = 0; a < r; a++) {
            const r = e.attributes[a];
            if (Is.definedString(r.nodeName) && n.ignoreAttributes.indexOf(r.nodeName) === -1) {
                t["@" + r.nodeName] = r.nodeValue;
                i.push(r.nodeName);
            }
        }
        if (n.generateUniqueMissingIds && i.indexOf("id") === -1 && n.ignoreAttributes.indexOf("id") === -1) {
            t[`${"@"}id`] = crypto.randomUUID();
        }
    }
    function l(e, t, n, r) {
        const i = getComputedStyle(e);
        const a = i.length;
        for (let e = 0; e < a; e++) {
            const a = i[e];
            if (n.ignoreCssProperties.indexOf(a) === -1) {
                const e = "$" + a;
                const n = i.getPropertyValue(a);
                if (!r.hasOwnProperty(e) || r[e] !== n) {
                    t[e] = n;
                    r[e] = t[e];
                }
            }
        }
    }
    function u(t, n, r, i, a) {
        let s = 0;
        n["&children"] = [];
        for (let l = 0; l < r; l++) {
            const r = t.children[l];
            const u = o(r, i, f(a));
            let d = false;
            if (e.formattingNodeTypes.indexOf(u.nodeName) > -1) {
                s++;
            } else {
                if (i.ignoreNodeTypes.indexOf(u.nodeName) === -1) {
                    d = true;
                    s++;
                }
            }
            if (d) {
                const e = {};
                e[u.nodeName] = u.nodeValues;
                n["&children"].push(e);
            }
        }
        return s;
    }
    function d(e, t, n) {
        if (Is.definedString(e.innerText)) {
            if (n > 0 && t.hasOwnProperty("&children") && t["&children"].length === 0) {
                t["#text"] = e.innerHTML;
            } else {
                if (e.innerText.trim() === e.innerHTML.trim()) {
                    t["#text"] = e.innerText;
                }
            }
        }
    }
    function f(e) {
        const t = {};
        for (let n in e) {
            if (e.hasOwnProperty(n)) {
                t[n] = e[n];
            }
        }
        return t;
    }
    function c() {
        return {
            json: "",
            templateData: {},
            removeOriginalAttributes: true,
            clearOriginalHTML: true,
            addCssToHead: false,
            clearCssFromHead: false,
            logTemplateDataWarnings: false,
            addAttributes: true,
            addCssProperties: true,
            addText: true,
            addChildren: true
        };
    }
    function g(t, n) {
        if (Is.definedObject(t) && Is.definedString(n.json)) {
            const r = Default2.getObjectFromString(n.json, e);
            const i = {
                css: {},
                templateDataKeys: [],
                templateDataKeysLength: 0,
                templateDataKeysProcessed: []
            };
            if (r.parsed && Is.definedObject(r.object)) {
                if (n.clearCssFromHead) {
                    h();
                }
                if (Is.definedObject(n.templateData)) {
                    m(n, i);
                }
                for (let e in r.object) {
                    if (e === t.nodeName.toLowerCase()) {
                        if (n.removeOriginalAttributes) {
                            while (t.attributes.length > 0) {
                                t.removeAttribute(t.attributes[0].name);
                            }
                        }
                        if (n.clearOriginalHTML) {
                            t.innerHTML = "";
                        }
                        p(t, r.object[e], n, i);
                    }
                }
                O(t);
                if (n.addCssToHead) {
                    D(i);
                }
                if (n.logTemplateDataWarnings) {
                    y(i);
                }
            }
        }
        return C;
    }
    function m(e, t) {
        for (let n in e.templateData) {
            if (e.templateData.hasOwnProperty(n)) {
                t.templateDataKeys.push(n);
            }
        }
        t.templateDataKeys = t.templateDataKeys.sort((function(e, t) {
            return t.length - e.length;
        }));
        t.templateDataKeysLength = t.templateDataKeys.length;
    }
    function p(e, t, n, r) {
        const i = [];
        for (let a in t) {
            if (Str.startsWithAnyCase(a, "@")) {
                if (n.addAttributes) {
                    const n = a.replace("@", "");
                    const r = t[a];
                    e.setAttribute(n, r);
                }
            } else if (Str.startsWithAnyCase(a, "$")) {
                if (n.addCssProperties) {
                    const r = a.replace("$", "");
                    if (!n.addCssToHead) {
                        e.style.setProperty(r, t[a]);
                    } else {
                        i.push(`${r}:${t[a]};`);
                    }
                }
            } else if (a === "#text") {
                if (n.addText) {
                    b(e, t[a], n, r);
                }
            } else if (a === "&children") {
                if (n.addChildren) {
                    const i = t[a].length;
                    for (let o = 0; o < i; o++) {
                        const i = t[a][o];
                        for (let t in i) {
                            if (i.hasOwnProperty(t)) {
                                const a = DomElement.create(e, t.toLowerCase());
                                p(a, i[t], n, r);
                            }
                        }
                    }
                }
            }
        }
        if (i.length > 0) {
            T(e, i, r);
        }
    }
    function b(e, t, n, r) {
        e.innerHTML = t;
        if (r.templateDataKeysLength > 0) {
            for (let t = 0; t < r.templateDataKeysLength; t++) {
                let i = r.templateDataKeys[t];
                if (n.templateData.hasOwnProperty(i)) {
                    const t = n.templateData[i];
                    if (e.innerHTML.indexOf(i) > -1) {
                        e.innerHTML = Str.replaceAll(e.innerHTML, i, t);
                        if (r.templateDataKeysProcessed.indexOf(i) === -1) {
                            r.templateDataKeysProcessed.push(i);
                        }
                    } else {
                        i = i.replace("}}", "") + " " + "|";
                        const n = e.innerHTML.indexOf(i);
                        if (n > -1) {
                            const r = e.innerHTML.indexOf("}}", n);
                            if (r > -1) {
                                const i = e.innerHTML.substring(n, r + "}}".length);
                                e.innerHTML = Str.replaceAll(e.innerHTML, i, t);
                            }
                        }
                    }
                }
            }
        }
    }
    function T(e, t, n) {
        let r = null;
        if (Is.definedString(e.className)) {
            const t = e.className.split(" ");
            r = `${e.nodeName.toLowerCase()}.${t[0]} {`;
        } else {
            if (!Is.definedString(e.id)) {
                e.id = crypto.randomUUID();
            }
            r = `#${e.id} {`;
        }
        let i = [];
        i.push(r);
        i = i.concat(t);
        i.push("}");
        n.css[e.id] = i;
    }
    function D(e) {
        const t = document.getElementsByTagName("head")[0];
        let n = [];
        for (let t in e.css) {
            if (e.css.hasOwnProperty(t)) {
                n = n.concat(e.css[t]);
            }
        }
        const r = DomElement.create(t, "style");
        r.appendChild(document.createTextNode(n.join("\n")));
    }
    function h() {
        const e = [].slice.call(document.getElementsByTagName("styles"));
        const t = e.length;
        for (let n = 0; n < t; n++) {
            e[n].parentNode.removeChild(e[n]);
        }
    }
    function y(t) {
        const n = t.templateDataKeysProcessed.length;
        if (t.templateDataKeysLength > n) {
            for (let n = 0; n < t.templateDataKeysLength; n++) {
                const r = t.templateDataKeys[n];
                if (t.templateDataKeysProcessed.indexOf(r) === -1) {
                    console.warn(e.text.variableWarningText.replace("{{variable_name}}", r));
                }
            }
        }
    }
    function O(e) {
        const t = Str.getTemplateVariables(e.innerHTML);
        const n = t.length;
        for (let r = 0; r < n; r++) {
            const n = t[r];
            if (n.indexOf("|") > -1) {
                const t = n.replace("{{", "").replace("}}", "").split("|")[1];
                if (Is.definedString(t)) {
                    e.innerHTML = e.innerHTML.replace(n, t.trim());
                }
            }
        }
    }
    const C = {
        json: function() {
            const e = i();
            const t = {
                includeAttributes: function(t) {
                    e.includeAttributes = Default2.getBoolean(t, e.includeAttributes);
                    return this;
                },
                includeCssProperties: function(t) {
                    e.includeCssProperties = Default2.getBoolean(t, e.includeCssProperties);
                    return this;
                },
                includeText: function(t) {
                    e.includeText = Default2.getBoolean(t, e.includeText);
                    return this;
                },
                includeChildren: function(t) {
                    e.includeChildren = Default2.getBoolean(t, e.includeChildren);
                    return this;
                },
                friendlyFormat: function(t) {
                    e.friendlyFormat = Default2.getBoolean(t, e.friendlyFormat);
                    return this;
                },
                indentSpaces: function(t) {
                    e.indentSpaces = Default2.getNumber(t, e.indentSpaces);
                    return this;
                },
                ignoreNodeTypes: function(t) {
                    e.ignoreNodeTypes = Default2.getStringOrArray(t, e.ignoreNodeTypes);
                    return this;
                },
                ignoreCssProperties: function(t) {
                    e.ignoreCssProperties = Default2.getStringOrArray(t, e.ignoreCssProperties);
                    return this;
                },
                ignoreAttributes: function(t) {
                    e.ignoreAttributes = Default2.getStringOrArray(t, e.ignoreAttributes);
                    return this;
                },
                generateUniqueMissingIds: function(t) {
                    e.generateUniqueMissingIds = Default2.getBoolean(t, e.generateUniqueMissingIds);
                    return this;
                },
                get: function(t) {
                    return a(t, e);
                },
                getVariables: function(e) {
                    return Str.getTemplateVariables(e);
                }
            };
            return t;
        },
        html: function() {
            const e = c();
            const t = {
                json: function(n) {
                    e.json = Default2.getString(n, e.json);
                    return t;
                },
                templateData: function(n) {
                    e.templateData = Default2.getObject(n, e.templateData);
                    return t;
                },
                removeOriginalAttributes: function(n) {
                    e.removeOriginalAttributes = Default2.getBoolean(n, e.removeOriginalAttributes);
                    return t;
                },
                clearOriginalHTML: function(n) {
                    e.clearOriginalHTML = Default2.getBoolean(n, e.clearOriginalHTML);
                    return t;
                },
                addCssToHead: function(n) {
                    e.addCssToHead = Default2.getBoolean(n, e.addCssToHead);
                    return t;
                },
                clearCssFromHead: function(n) {
                    e.clearCssFromHead = Default2.getBoolean(n, e.clearCssFromHead);
                    return t;
                },
                logTemplateDataWarnings: function(n) {
                    e.logTemplateDataWarnings = Default2.getBoolean(n, e.logTemplateDataWarnings);
                    return t;
                },
                addAttributes: function(n) {
                    e.addAttributes = Default2.getBoolean(n, e.addAttributes);
                    return t;
                },
                addCssProperties: function(n) {
                    e.addCssProperties = Default2.getBoolean(n, e.addCssProperties);
                    return t;
                },
                addText: function(n) {
                    e.addText = Default2.getBoolean(n, e.addText);
                    return t;
                },
                addChildren: function(n) {
                    e.addChildren = Default2.getBoolean(n, e.addChildren);
                    return t;
                },
                write: function(t) {
                    return g(t, e);
                },
                getVariables: function(e) {
                    let t = [];
                    if (Is.definedObject(e)) {
                        t = Str.getTemplateVariables(e.innerHTML);
                    }
                    return t;
                }
            };
            return t;
        },
        setConfiguration: function(t) {
            if (Is.definedObject(t)) {
                let n = false;
                const r = e;
                for (let i in t) {
                    if (t.hasOwnProperty(i) && e.hasOwnProperty(i) && r[i] !== t[i]) {
                        r[i] = t[i];
                        n = true;
                    }
                }
                if (n) {
                    e = Config.Options.get(r);
                }
            }
            return C;
        },
        getVersion: function() {
            return "2.1.0";
        }
    };
    (() => {
        e = Config.Options.get();
        document.addEventListener("DOMContentLoaded", (() => t()));
        if (!Is.defined(window.$jhson)) {
            window.$jhson = C;
        }
    })();
})();//# sourceMappingURL=jhson.esm.js.map