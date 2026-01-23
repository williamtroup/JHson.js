"use strict";

var e;

(e => {
    e.JHSON_JS_ATTRIBUTE_NAME = "data-jhson-js";
})(e || (e = {}));

var t;

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
    function o(e) {
        return t(e) && typeof e === "function";
    }
    e.definedFunction = o;
    function a(e) {
        return t(e) && typeof e === "number";
    }
    e.definedNumber = a;
    function s(e) {
        return n(e) && e instanceof Array;
    }
    e.definedArray = s;
})(t || (t = {}));

var n;

(e => {
    function n(e, n) {
        return t.definedString(e) ? e : n;
    }
    e.getString = n;
    function r(e, n) {
        return t.definedBoolean(e) ? e : n;
    }
    e.getBoolean = r;
    function i(e, n) {
        return t.definedNumber(e) ? e : n;
    }
    e.getNumber = i;
    function o(e, n) {
        return t.definedFunction(e) ? e : n;
    }
    e.getFunction = o;
    function a(e, n) {
        return t.definedArray(e) ? e : n;
    }
    e.getArray = a;
    function s(e, n) {
        return t.definedObject(e) ? e : n;
    }
    e.getObject = s;
    function l(e, n) {
        let r = n;
        if (t.definedString(e)) {
            const t = e.toString().split(" ");
            if (t.length === 0) {
                e = n;
            } else {
                r = t;
            }
        } else {
            r = a(e, n);
        }
        return r;
    }
    e.getStringOrArray = l;
    function d(e, n) {
        const r = {
            parsed: true,
            object: null
        };
        try {
            if (t.definedString(e)) {
                try {
                    r.object = JSON.parse(e);
                } catch {
                    r.object = JSON.parse(e.replace(/'/g, '"'));
                }
            }
        } catch (t) {
            try {
                r.object = c(e);
            } catch (e) {
                if (!n.safeMode) {
                    console.error(n.text.objectErrorText.replace("{{error_1}}", t.message).replace("{{error_2}}", e.message));
                    r.parsed = false;
                }
                r.object = null;
            }
        }
        return r;
    }
    e.getObjectFromString = d;
    function c(e) {
        let n = null;
        const r = e.split("(");
        let i = [];
        if (r.length > 1) {
            i = r[1].replace(")", "").replace(";", "").trim().split(",");
            if (i.length === 1 && i[0] === "") {
                i = [];
            }
        }
        const o = r[0].split(".");
        const a = o.pop();
        let s = globalThis;
        let l = true;
        for (const e of o) {
            s = s[e];
            if (!t.defined(s)) {
                l = false;
                break;
            }
        }
        if (l && t.definedFunction(s[a])) {
            n = s[a].apply(s, i);
        }
        return n;
    }
})(n || (n = {}));

var r;

(e => {
    function t(e, t) {
        const r = n(t);
        e.appendChild(r);
        return r;
    }
    e.create = t;
    function n(e) {
        const t = e.toLowerCase();
        const n = t === "text";
        const r = n ? document.createTextNode("") : document.createElement(t);
        return r;
    }
    e.createWithNoContainer = n;
})(r || (r = {}));

var i;

(e => {
    function n(e, t) {
        return e.substring(0, t.length).toLowerCase() === t.toLowerCase();
    }
    e.startsWithAnyCase = n;
    function r(e, t, n) {
        return e.replace(new RegExp(t.replace("|", `[${"|"}]`), "g"), n);
    }
    e.replaceAll = r;
    function i(e) {
        const n = [];
        if (t.definedString(e)) {
            let t = 0;
            let r = 0;
            while (t > -1) {
                t = e.indexOf("{{", r);
                if (t > -1) {
                    r = e.indexOf("}}", t);
                    if (r > -1) {
                        const i = e.substring(t, r + "}}".length);
                        n.push(i);
                        r += 2;
                    }
                }
            }
        }
        return n;
    }
    e.getTemplateVariables = i;
})(i || (i = {}));

var o;

(e => {
    let t;
    (e => {
        function t(e = null) {
            let t = n.getObject(e, {});
            t.safeMode = n.getBoolean(t.safeMode, true);
            t.domElementTypes = n.getStringOrArray(t.domElementTypes, [ "*" ]);
            t.formattingNodeTypes = n.getStringOrArray(t.formattingNodeTypes, [ "b", "strong", "i", "em", "mark", "small", "del", "ins", "sub", "sup" ]);
            t = r(t);
            return t;
        }
        e.get = t;
        function r(e) {
            e.text = n.getObject(e.text, {});
            e.text.variableWarningText = n.getString(e.text.variableWarningText, "Template variable {{variable_name}} not found.");
            e.text.objectErrorText = n.getString(e.text.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
            e.text.attributeNotValidErrorText = n.getString(e.text.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
            e.text.attributeNotSetErrorText = n.getString(e.text.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
            return e;
        }
    })(t = e.Options || (e.Options = {}));
})(o || (o = {}));

var a;

(e => {
    let t;
    (e => {
        function t(e, t, n) {
            const i = r(e, n);
            i._currentView = {};
            i._currentView.element = t;
            return i;
        }
        e.getForNewInstance = t;
        function r(e, t) {
            let r = n.getObject(e, {});
            r.json = n.getString(r.json, t.json);
            r.templateData = n.getObject(r.templateData, t.templateData);
            r.removeOriginalAttributes = n.getBoolean(r.removeOriginalAttributes, t.removeOriginalAttributes);
            r.removeOriginalDataAttributes = n.getBoolean(r.removeOriginalDataAttributes, t.removeOriginalDataAttributes);
            r.clearOriginalHTML = n.getBoolean(r.clearOriginalHTML, t.clearOriginalHTML);
            r.addCssToHead = n.getBoolean(r.addCssToHead, t.addCssToHead);
            r.clearCssFromHead = n.getBoolean(r.clearCssFromHead, t.clearCssFromHead);
            r.logTemplateDataWarnings = n.getBoolean(r.logTemplateDataWarnings, t.logTemplateDataWarnings);
            r.addAttributes = n.getBoolean(r.addAttributes, t.addAttributes);
            r.addDataAttributes = n.getBoolean(r.addDataAttributes, t.addDataAttributes);
            r.addCssProperties = n.getBoolean(r.addCssProperties, t.addCssProperties);
            r.addText = n.getBoolean(r.addText, t.addText);
            r.addChildren = n.getBoolean(r.addChildren, t.addChildren);
            r.insertBefore = n.getBoolean(r.insertBefore, t.insertBefore);
            r = i(r);
            return r;
        }
        e.get = r;
        function i(e) {
            e.events = n.getObject(e.events, {});
            e.events.onBeforeRender = n.getFunction(e.events.onBeforeRender, null);
            e.events.onRenderComplete = n.getFunction(e.events.onRenderComplete, null);
            return e;
        }
    })(t = e.Options || (e.Options = {}));
})(a || (a = {}));

var s;

(e => {
    function n(e, ...n) {
        if (t.definedFunction(e)) {
            e.apply(null, [].slice.call(n, 0));
        }
    }
    e.customEvent = n;
})(s || (s = {}));

(() => {
    let l = {};
    function d() {
        const e = l.domElementTypes;
        const t = e.length;
        for (let n = 0; n < t; n++) {
            const t = document.getElementsByTagName(e[n]);
            const r = [].slice.call(t);
            const i = r.length;
            for (let e = 0; e < i; e++) {
                if (!c(r[e])) {
                    break;
                }
            }
        }
    }
    function c(r) {
        let i = true;
        if (t.defined(r) && r.hasAttribute(e.JHSON_JS_ATTRIBUTE_NAME)) {
            const o = r.getAttribute(e.JHSON_JS_ATTRIBUTE_NAME);
            if (t.definedString(o)) {
                const s = n.getObjectFromString(o, l);
                if (s.parsed && t.definedObject(s.object)) {
                    u(a.Options.getForNewInstance(s.object, r, A()));
                } else {
                    if (!l.safeMode) {
                        console.error(l.text.attributeNotValidErrorText.replace("{{attribute_name}}", e.JHSON_JS_ATTRIBUTE_NAME));
                        i = false;
                    }
                }
            } else {
                if (!l.safeMode) {
                    console.error(l.text.attributeNotSetErrorText.replace("{{attribute_name}}", e.JHSON_JS_ATTRIBUTE_NAME));
                    i = false;
                }
            }
        }
        return i;
    }
    function u(e) {
        s.customEvent(e.events.onBeforeRender, e._currentView.element);
        const t = A(e);
        N(e._currentView.element, t);
        s.customEvent(e.events.onRenderComplete, e._currentView.element);
    }
    function f() {
        return {
            includeAttributes: true,
            includeDataAttributes: true,
            includeCssProperties: false,
            includeText: true,
            includeChildren: true,
            includeImagesAsBase64: false,
            friendlyFormat: true,
            indentSpaces: 2,
            ignoreNodeTypes: [],
            ignoreNodeCondition: null,
            ignoreCssProperties: [],
            ignoreAttributes: [],
            generateUniqueMissingIds: false,
            generateUniqueMissingNames: false,
            propertyReplacer: null
        };
    }
    function g(e, n) {
        let r = "";
        if (t.definedObject(e)) {
            const t = {};
            const i = p(e, n, {});
            t[i.nodeName] = i.nodeValues;
            if (n.friendlyFormat) {
                r = JSON.stringify(t, n.propertyReplacer, n.indentSpaces);
            } else {
                r = JSON.stringify(t, n.propertyReplacer);
            }
        }
        return r;
    }
    function p(e, t, n) {
        const r = {};
        const i = e.children.length;
        let o = 0;
        if (t.includeAttributes) {
            m(e, r, t);
        }
        if (t.includeCssProperties) {
            b(e, r, t, n);
        }
        if (t.includeChildren && i > 0) {
            o = h(e, r, i, t, n);
        }
        if (t.includeText) {
            T(e, r, o);
        }
        if (Object.prototype.hasOwnProperty.call(r, "&children") && r["&children"].length === 0) {
            delete r["&children"];
        }
        return {
            nodeName: e.nodeName.toLowerCase(),
            nodeValues: r
        };
    }
    function m(e, n, r) {
        const i = e.attributes.length;
        const o = [];
        if (r.includeText && e.nodeName.toLowerCase() === "textarea") {
            const r = e;
            if (t.defined(r.value)) {
                n["#text"] = r.value;
            }
        }
        for (let a = 0; a < i; a++) {
            const i = e.attributes[a];
            if (t.definedString(i.nodeName) && r.ignoreAttributes.indexOf(i.nodeName) === -1) {
                if (r.includeDataAttributes || !i.nodeName.startsWith("data-")) {
                    const t = `${"@"}${i.nodeName}`;
                    if (!r.includeCssProperties || i.nodeName !== "style") {
                        if (e.nodeName.toLowerCase() === "img" && i.nodeName === "src" && r.includeImagesAsBase64) {
                            n[t] = y(e);
                        } else {
                            n[t] = i.nodeValue;
                        }
                        o.push(i.nodeName);
                    }
                }
            }
        }
        if (r.generateUniqueMissingIds && o.indexOf("id") === -1 && r.ignoreAttributes.indexOf("id") === -1) {
            n[`${"@"}${"id"}`] = crypto.randomUUID();
        }
        if (r.generateUniqueMissingNames && o.indexOf("name") === -1 && r.ignoreAttributes.indexOf("name") === -1) {
            n[`${"@"}${"name"}`] = crypto.randomUUID();
        }
    }
    function b(e, t, n, r) {
        const i = getComputedStyle(e);
        const o = i.length;
        for (let e = 0; e < o; e++) {
            const o = i[e];
            if (n.ignoreCssProperties.indexOf(o) === -1) {
                const e = `${"$"}${o}`;
                const n = i.getPropertyValue(o);
                if (!Object.prototype.hasOwnProperty.call(r, e) || r[e] !== n) {
                    t[e] = n;
                    r[e] = t[e];
                }
            }
        }
    }
    function h(e, n, r, i, o) {
        let a = 0;
        n["&children"] = [];
        for (let s = 0; s < r; s++) {
            const r = e.children[s];
            const d = p(r, i, O(o));
            let c = false;
            if (l.formattingNodeTypes.indexOf(d.nodeName) > -1) {
                a++;
            } else {
                if (i.ignoreNodeTypes.indexOf(d.nodeName) === -1) {
                    if (!t.definedFunction(i.ignoreNodeCondition) || !i.ignoreNodeCondition(r)) {
                        c = true;
                        a++;
                    }
                }
            }
            if (c) {
                const e = {};
                e[d.nodeName] = d.nodeValues;
                n["&children"].push(e);
            }
        }
        return a;
    }
    function T(e, n, r) {
        if (t.definedString(e.innerText)) {
            if (r > 0 && Object.prototype.hasOwnProperty.call(n, "&children") && n["&children"].length === 0) {
                n["#text"] = e.innerHTML;
            } else {
                if (e.innerText.trim() === e.innerHTML.trim()) {
                    n["#text"] = e.innerText;
                }
            }
        }
    }
    function O(e) {
        const t = {};
        for (const n in e) {
            if (Object.prototype.hasOwnProperty.call(e, n)) {
                t[n] = e[n];
            }
        }
        return t;
    }
    function y(e) {
        const t = r.createWithNoContainer("canvas");
        t.width = e.width;
        t.height = e.height;
        const n = t.getContext("2d");
        n.drawImage(e, 0, 0, e.width, e.height);
        const i = t.toDataURL();
        return i;
    }
    function A(e = null) {
        const n = t.definedObject(e);
        return {
            json: n ? e.json : "",
            templateData: n ? e.templateData : {},
            removeOriginalAttributes: n ? e.removeOriginalAttributes : true,
            removeOriginalDataAttributes: n ? e.removeOriginalDataAttributes : true,
            clearOriginalHTML: n ? e.clearOriginalHTML : true,
            addCssToHead: n ? e.addCssToHead : false,
            clearCssFromHead: n ? e.clearCssFromHead : false,
            logTemplateDataWarnings: n ? e.logTemplateDataWarnings : false,
            addAttributes: n ? e.addAttributes : true,
            addDataAttributes: n ? e.addDataAttributes : true,
            addCssProperties: n ? e.addCssProperties : true,
            addText: n ? e.addText : true,
            addChildren: n ? e.addChildren : true,
            insertBefore: n ? e.insertBefore : false
        };
    }
    function C(e) {
        let i = null;
        if (t.definedString(e.json)) {
            const o = n.getObjectFromString(e.json, l);
            for (const e in o.object) {
                i = r.createWithNoContainer(e);
                break;
            }
            if (t.defined(i)) {
                N(i, e, o);
            }
        }
        return i;
    }
    function N(e, r, i = null) {
        if (t.definedObject(e) && t.definedString(r.json)) {
            let o = i;
            if (!t.definedObject(o)) {
                o = n.getObjectFromString(r.json, l);
            }
            const a = {
                css: {},
                templateDataKeys: [],
                templateDataKeysLength: 0,
                templateDataKeysProcessed: []
            };
            if (o.parsed && t.definedObject(o.object)) {
                if (r.clearCssFromHead) {
                    v();
                }
                if (t.definedObject(r.templateData)) {
                    x(r, a);
                }
                for (const t in o.object) {
                    if (t === e.nodeName.toLowerCase()) {
                        if (r.removeOriginalAttributes) {
                            let t = e.attributes.length;
                            while (t > 0) {
                                const n = e.attributes[0].name;
                                if (r.removeOriginalDataAttributes || !n.startsWith("data-")) {
                                    e.removeAttribute(n);
                                }
                                t--;
                            }
                        }
                        if (r.clearOriginalHTML) {
                            e.innerHTML = "";
                        }
                        j(e, o.object[t], r, a);
                        break;
                    }
                }
                M(e);
                if (r.addCssToHead) {
                    S(a);
                }
                if (r.logTemplateDataWarnings) {
                    H(a);
                }
            }
        }
        return L;
    }
    function x(e, t) {
        for (const n in e.templateData) {
            if (Object.prototype.hasOwnProperty.call(e.templateData, n)) {
                t.templateDataKeys.push(n);
            }
        }
        t.templateDataKeys = t.templateDataKeys.sort(function(e, t) {
            return t.length - e.length;
        });
        t.templateDataKeysLength = t.templateDataKeys.length;
    }
    function j(e, t, n, o) {
        const a = [];
        for (const s in t) {
            if (i.startsWithAnyCase(s, "@")) {
                if (n.addAttributes) {
                    const r = s.replace("@", "");
                    if (n.addDataAttributes || !r.startsWith("data-")) {
                        const n = t[s];
                        e.setAttribute(r, n);
                    }
                }
            } else if (i.startsWithAnyCase(s, "$")) {
                if (n.addCssProperties) {
                    const r = s.replace("$", "");
                    if (!n.addCssToHead) {
                        e.style.setProperty(r, t[s]);
                    } else {
                        a.push(`${r}:${t[s]};`);
                    }
                }
            } else if (s === "#text") {
                if (n.addText) {
                    D(e, t[s], n, o);
                }
            } else if (s === "&children") {
                if (n.addChildren) {
                    const i = t[s].length;
                    for (let a = 0; a < i; a++) {
                        const i = t[s][a];
                        for (const t in i) {
                            if (Object.prototype.hasOwnProperty.call(i, t)) {
                                const a = r.create(e, t.toLowerCase());
                                j(a, i[t], n, o);
                            }
                        }
                    }
                }
            }
        }
        if (a.length > 0) {
            B(e, a, o);
        }
    }
    function D(e, t, n, r) {
        e.innerHTML = t;
        if (r.templateDataKeysLength > 0) {
            for (let t = 0; t < r.templateDataKeysLength; t++) {
                let o = r.templateDataKeys[t];
                if (Object.prototype.hasOwnProperty.call(n.templateData, o)) {
                    const t = n.templateData[o];
                    if (e.innerHTML.indexOf(o) > -1) {
                        e.innerHTML = i.replaceAll(e.innerHTML, o, t);
                        if (r.templateDataKeysProcessed.indexOf(o) === -1) {
                            r.templateDataKeysProcessed.push(o);
                        }
                    } else {
                        o = `${o.replace("}}", "")}${" "}${"|"}`;
                        const n = e.innerHTML.indexOf(o);
                        if (n > -1) {
                            const r = e.innerHTML.indexOf("}}", n);
                            if (r > -1) {
                                const o = e.innerHTML.substring(n, r + "}}".length);
                                e.innerHTML = i.replaceAll(e.innerHTML, o, t);
                            }
                        }
                    }
                }
            }
        }
    }
    function B(e, n, r) {
        let i = null;
        if (t.definedString(e.className)) {
            const t = e.className.split(" ");
            i = `${e.nodeName.toLowerCase()}.${t[0]} {`;
        } else {
            if (!t.definedString(e.id)) {
                e.id = crypto.randomUUID();
            }
            i = `#${e.id} {`;
        }
        let o = [];
        o.push(i);
        o = o.concat(n);
        o.push("}");
        r.css[e.id] = o;
    }
    function S(e) {
        const t = document.getElementsByTagName("head")[0];
        let n = [];
        for (const t in e.css) {
            if (Object.prototype.hasOwnProperty.call(e.css, t)) {
                n = n.concat(e.css[t]);
            }
        }
        const i = r.create(t, "style");
        i.appendChild(document.createTextNode(n.join("\n")));
    }
    function v() {
        const e = [].slice.call(document.getElementsByTagName("styles"));
        const t = e.length;
        for (let n = 0; n < t; n++) {
            e[n].parentNode.removeChild(e[n]);
        }
    }
    function H(e) {
        const t = e.templateDataKeysProcessed.length;
        if (e.templateDataKeysLength > t) {
            for (let t = 0; t < e.templateDataKeysLength; t++) {
                const n = e.templateDataKeys[t];
                if (e.templateDataKeysProcessed.indexOf(n) === -1) {
                    console.warn(l.text.variableWarningText.replace("{{variable_name}}", n));
                }
            }
        }
    }
    function M(e) {
        const n = i.getTemplateVariables(e.innerHTML);
        const r = n.length;
        for (let i = 0; i < r; i++) {
            const r = n[i];
            if (r.indexOf("|") > -1) {
                const n = r.replace("{{", "").replace("}}", "").split("|")[1];
                if (t.definedString(n)) {
                    e.innerHTML = e.innerHTML.replace(r, n.trim());
                }
            }
        }
    }
    const L = {
        json: function() {
            const e = f();
            const t = {
                includeAttributes: function(t) {
                    e.includeAttributes = n.getBoolean(t, e.includeAttributes);
                    return this;
                },
                includeDataAttributes: function(t) {
                    e.includeDataAttributes = n.getBoolean(t, e.includeDataAttributes);
                    return this;
                },
                includeCssProperties: function(t) {
                    e.includeCssProperties = n.getBoolean(t, e.includeCssProperties);
                    return this;
                },
                includeText: function(t) {
                    e.includeText = n.getBoolean(t, e.includeText);
                    return this;
                },
                includeChildren: function(t) {
                    e.includeChildren = n.getBoolean(t, e.includeChildren);
                    return this;
                },
                includeImagesAsBase64: function(t) {
                    e.includeImagesAsBase64 = n.getBoolean(t, e.includeImagesAsBase64);
                    return this;
                },
                friendlyFormat: function(t) {
                    e.friendlyFormat = n.getBoolean(t, e.friendlyFormat);
                    return this;
                },
                indentSpaces: function(t) {
                    e.indentSpaces = n.getNumber(t, e.indentSpaces);
                    return this;
                },
                ignoreNodeTypes: function(t) {
                    e.ignoreNodeTypes = n.getStringOrArray(t, e.ignoreNodeTypes);
                    return this;
                },
                ignoreNodeCondition: function(t) {
                    e.ignoreNodeCondition = n.getFunction(t, e.ignoreNodeCondition);
                    return this;
                },
                ignoreCssProperties: function(t) {
                    e.ignoreCssProperties = n.getStringOrArray(t, e.ignoreCssProperties);
                    return this;
                },
                ignoreAttributes: function(t) {
                    e.ignoreAttributes = n.getStringOrArray(t, e.ignoreAttributes);
                    return this;
                },
                generateUniqueMissingIds: function(t) {
                    e.generateUniqueMissingIds = n.getBoolean(t, e.generateUniqueMissingIds);
                    return this;
                },
                generateUniqueMissingNames: function(t) {
                    e.generateUniqueMissingNames = n.getBoolean(t, e.generateUniqueMissingNames);
                    return this;
                },
                propertyReplacer: function(t) {
                    e.propertyReplacer = n.getFunction(t, e.propertyReplacer);
                    return this;
                },
                get: function(t) {
                    return g(t, e);
                },
                getVariables: function(e) {
                    return i.getTemplateVariables(e);
                }
            };
            return t;
        },
        html: function() {
            const e = A();
            const r = {
                json: function(t) {
                    e.json = n.getString(t, e.json);
                    return r;
                },
                templateData: function(t) {
                    e.templateData = n.getObject(t, e.templateData);
                    return r;
                },
                removeOriginalAttributes: function(t) {
                    e.removeOriginalAttributes = n.getBoolean(t, e.removeOriginalAttributes);
                    return r;
                },
                removeOriginalDataAttributes: function(t) {
                    e.removeOriginalDataAttributes = n.getBoolean(t, e.removeOriginalDataAttributes);
                    return r;
                },
                clearOriginalHTML: function(t) {
                    e.clearOriginalHTML = n.getBoolean(t, e.clearOriginalHTML);
                    return r;
                },
                addCssToHead: function(t) {
                    e.addCssToHead = n.getBoolean(t, e.addCssToHead);
                    return r;
                },
                clearCssFromHead: function(t) {
                    e.clearCssFromHead = n.getBoolean(t, e.clearCssFromHead);
                    return r;
                },
                logTemplateDataWarnings: function(t) {
                    e.logTemplateDataWarnings = n.getBoolean(t, e.logTemplateDataWarnings);
                    return r;
                },
                addAttributes: function(t) {
                    e.addAttributes = n.getBoolean(t, e.addAttributes);
                    return r;
                },
                addDataAttributes: function(t) {
                    e.addDataAttributes = n.getBoolean(t, e.addDataAttributes);
                    return r;
                },
                addCssProperties: function(t) {
                    e.addCssProperties = n.getBoolean(t, e.addCssProperties);
                    return r;
                },
                addText: function(t) {
                    e.addText = n.getBoolean(t, e.addText);
                    return r;
                },
                addChildren: function(t) {
                    e.addChildren = n.getBoolean(t, e.addChildren);
                    return r;
                },
                insertBefore: function(t) {
                    e.insertBefore = n.getBoolean(t, e.insertBefore);
                    return r;
                },
                write: function(t) {
                    return N(t, e);
                },
                get: function() {
                    return C(e);
                },
                getVariables: function(e) {
                    let n = [];
                    if (t.definedObject(e)) {
                        n = i.getTemplateVariables(e.innerHTML);
                    }
                    return n;
                }
            };
            return r;
        },
        render: function(e, n) {
            if (t.definedObject(e) && t.definedObject(n)) {
                u(a.Options.getForNewInstance(n, e, A()));
            }
            return L;
        },
        renderAll: function() {
            d();
            return L;
        },
        setConfiguration: function(e) {
            if (t.definedObject(e)) {
                let t = false;
                const n = l;
                for (const r in e) {
                    if (Object.prototype.hasOwnProperty.call(e, r) && Object.prototype.hasOwnProperty.call(l, r) && n[r] !== e[r]) {
                        n[r] = e[r];
                        t = true;
                    }
                }
                if (t) {
                    l = o.Options.get(n);
                }
            }
            return L;
        },
        getVersion: function() {
            return "2.4.0";
        }
    };
    (() => {
        l = o.Options.get();
        document.addEventListener("DOMContentLoaded", () => d());
        if (!t.defined(window.$jhson)) {
            window.$jhson = L;
        }
    })();
})();//# sourceMappingURL=jhson.js.map