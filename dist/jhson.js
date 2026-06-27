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
    function a(e, n) {
        return t.definedFunction(e) ? e : n;
    }
    e.getFunction = a;
    function o(e, n) {
        return t.definedArray(e) ? e : n;
    }
    e.getArray = o;
    function s(e, n) {
        return t.definedObject(e) ? e : n;
    }
    e.getObject = s;
    function l(e, n) {
        let r = n;
        if (t.definedString(e)) {
            const t = e.toString().split(" ");
            if (t.length > 0) {
                r = t;
            }
        } else {
            r = o(e, n);
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
        const a = r[0].split(".");
        const o = a.pop();
        let s = globalThis;
        let l = true;
        for (const e of a) {
            s = s[e];
            if (!t.defined(s)) {
                l = false;
                break;
            }
        }
        if (l && t.definedFunction(s[o])) {
            n = s[o].apply(s, i);
        }
        return n;
    }
})(n || (n = {}));

var r;

(e => {
    function n(e, n, r = null) {
        const i = n.toLowerCase();
        const a = document.createElement(i);
        if (t.defined(r)) {
            e.insertBefore(a, r);
        } else {
            e.appendChild(a);
        }
        return a;
    }
    e.create = n;
    function r(e) {
        const t = e.toLowerCase();
        const n = t === "text";
        const r = n ? document.createTextNode("") : document.createElement(t);
        return r;
    }
    e.createWithNoContainer = r;
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

var a;

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
})(a || (a = {}));

var o;

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
})(o || (o = {}));

var s;

(e => {
    function n(e, ...n) {
        if (t.definedFunction(e)) {
            e.apply(null, [].slice.call(n, 0));
        }
    }
    e.customEvent = n;
})(s || (s = {}));

var l;

(e => {
    function t(e) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => e());
        } else {
            e();
        }
    }
    e.onContentLoaded = t;
})(l || (l = {}));

(() => {
    let d = {};
    function c() {
        const e = d.domElementTypes;
        const t = e.length;
        for (let n = 0; n < t; n++) {
            const t = document.getElementsByTagName(e[n]);
            const r = [].slice.call(t);
            const i = r.length;
            for (let e = 0; e < i; e++) {
                if (!u(r[e])) {
                    break;
                }
            }
        }
    }
    function u(r) {
        let i = true;
        if (t.defined(r) && r.hasAttribute(e.JHSON_JS_ATTRIBUTE_NAME)) {
            const a = r.getAttribute(e.JHSON_JS_ATTRIBUTE_NAME);
            if (t.definedString(a)) {
                const s = n.getObjectFromString(a, d);
                if (s.parsed && t.definedObject(s.object)) {
                    f(o.Options.getForNewInstance(s.object, r, C()));
                } else {
                    if (!d.safeMode) {
                        console.error(d.text.attributeNotValidErrorText.replace("{{attribute_name}}", e.JHSON_JS_ATTRIBUTE_NAME));
                        i = false;
                    }
                }
            } else {
                if (!d.safeMode) {
                    console.error(d.text.attributeNotSetErrorText.replace("{{attribute_name}}", e.JHSON_JS_ATTRIBUTE_NAME));
                    i = false;
                }
            }
        }
        return i;
    }
    function f(e) {
        s.customEvent(e.events.onBeforeRender, e._currentView.element);
        const t = C(e);
        x(e._currentView.element, t);
        s.customEvent(e.events.onRenderComplete, e._currentView.element);
    }
    function g() {
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
            ignoreElementIds: [],
            generateUniqueMissingIds: false,
            generateUniqueMissingNames: false,
            propertyReplacer: null
        };
    }
    function p(e, n) {
        let r = "";
        if (t.definedObject(e)) {
            const t = {};
            const i = m(e, n, {}, false);
            t[i.nodeName] = i.nodeValues;
            if (n.friendlyFormat) {
                r = JSON.stringify(t, n.propertyReplacer, n.indentSpaces);
            } else {
                r = JSON.stringify(t, n.propertyReplacer);
            }
        }
        return r;
    }
    function m(e, n, r, i = true) {
        let a = null;
        const o = {};
        if (!i || (!t.definedString(e.id) || n.ignoreElementIds.indexOf(e.id) === -1)) {
            const t = e.children.length;
            let i = 0;
            if (n.includeAttributes) {
                b(e, o, n);
            }
            if (n.includeCssProperties) {
                O(e, o, n, r);
            }
            if (n.includeChildren && t > 0) {
                i = T(e, o, t, n, r);
            }
            if (n.includeText) {
                h(e, o, i);
            }
            if (Object.prototype.hasOwnProperty.call(o, "&children") && o["&children"].length === 0) {
                delete o["&children"];
            }
            a = {
                nodeName: e.nodeName.toLowerCase(),
                nodeValues: o
            };
        }
        return a;
    }
    function b(e, n, r) {
        const i = e.attributes.length;
        const a = [];
        if (r.includeText && e.nodeName.toLowerCase() === "textarea") {
            const r = e;
            if (t.defined(r.value)) {
                n["#text"] = r.value;
            }
        }
        for (let o = 0; o < i; o++) {
            const i = e.attributes[o];
            if (t.definedString(i.nodeName) && r.ignoreAttributes.indexOf(i.nodeName) === -1) {
                if (r.includeDataAttributes || !i.nodeName.startsWith("data-")) {
                    const t = `${"@"}${i.nodeName}`;
                    if (!r.includeCssProperties || i.nodeName !== "style") {
                        if (e.nodeName.toLowerCase() === "img" && i.nodeName === "src" && r.includeImagesAsBase64) {
                            n[t] = A(e);
                        } else {
                            n[t] = i.nodeValue;
                        }
                        a.push(i.nodeName);
                    }
                }
            }
        }
        if (r.generateUniqueMissingIds && a.indexOf("id") === -1 && r.ignoreAttributes.indexOf("id") === -1) {
            n[`${"@"}${"id"}`] = crypto.randomUUID();
        }
        if (r.generateUniqueMissingNames && a.indexOf("name") === -1 && r.ignoreAttributes.indexOf("name") === -1) {
            n[`${"@"}${"name"}`] = crypto.randomUUID();
        }
    }
    function O(e, t, n, r) {
        const i = getComputedStyle(e);
        const a = i.length;
        for (let e = 0; e < a; e++) {
            const a = i[e];
            if (n.ignoreCssProperties.indexOf(a) === -1) {
                const e = `${"$"}${a}`;
                const n = i.getPropertyValue(a);
                if (!Object.prototype.hasOwnProperty.call(r, e) || r[e] !== n) {
                    t[e] = n;
                    r[e] = t[e];
                }
            }
        }
    }
    function T(e, n, r, i, a) {
        let o = 0;
        n["&children"] = [];
        for (let s = 0; s < r; s++) {
            const r = e.children[s];
            const l = m(r, i, y(a));
            let c = false;
            if (t.definedObject(l)) {
                if (d.formattingNodeTypes.indexOf(l.nodeName) > -1) {
                    o++;
                } else {
                    if (i.ignoreNodeTypes.indexOf(l.nodeName) === -1) {
                        if (!t.definedFunction(i.ignoreNodeCondition) || !i.ignoreNodeCondition(r)) {
                            c = true;
                            o++;
                        }
                    }
                }
            }
            if (c) {
                const e = {};
                e[l.nodeName] = l.nodeValues;
                n["&children"].push(e);
            }
        }
        return o;
    }
    function h(e, n, r) {
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
    function y(e) {
        const t = {};
        for (const n in e) {
            if (Object.prototype.hasOwnProperty.call(e, n)) {
                t[n] = e[n];
            }
        }
        return t;
    }
    function A(e) {
        const t = r.createWithNoContainer("canvas");
        t.width = e.width;
        t.height = e.height;
        const n = t.getContext("2d");
        n.drawImage(e, 0, 0, e.width, e.height);
        const i = t.toDataURL();
        return i;
    }
    function C(e = null) {
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
    function N(e) {
        let i = null;
        if (t.definedString(e.json)) {
            const a = n.getObjectFromString(e.json, d);
            for (const e in a.object) {
                i = r.createWithNoContainer(e);
                break;
            }
            if (t.defined(i)) {
                x(i, e, a);
            }
        }
        return i;
    }
    function x(e, r, i = null) {
        if (t.definedObject(e) && t.definedString(r.json)) {
            let a = i;
            if (!t.definedObject(a)) {
                a = n.getObjectFromString(r.json, d);
            }
            const o = {
                css: {},
                templateDataKeys: [],
                templateDataKeysLength: 0,
                templateDataKeysProcessed: []
            };
            if (a.parsed && t.definedObject(a.object)) {
                if (r.clearCssFromHead) {
                    H();
                }
                if (t.definedObject(r.templateData)) {
                    j(r, o);
                }
                for (const t in a.object) {
                    if (t === e.nodeName.toLowerCase()) {
                        let n = null;
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
                        } else if (r.insertBefore && e.children.length > 0) {
                            n = e.children[0];
                        }
                        D(e, a.object[t], r, o, n);
                        break;
                    }
                }
                M(e);
                if (r.addCssToHead) {
                    v(o);
                }
                if (r.logTemplateDataWarnings) {
                    L(o);
                }
            }
        }
        return w;
    }
    function j(e, t) {
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
    function D(e, t, n, a, o) {
        const s = [];
        for (const l in t) {
            if (i.startsWithAnyCase(l, "@")) {
                if (n.addAttributes) {
                    const r = l.replace("@", "");
                    if (n.addDataAttributes || !r.startsWith("data-")) {
                        const n = t[l];
                        e.setAttribute(r, n);
                    }
                }
            } else if (i.startsWithAnyCase(l, "$")) {
                if (n.addCssProperties) {
                    const r = l.replace("$", "");
                    if (!n.addCssToHead) {
                        e.style.setProperty(r, t[l]);
                    } else {
                        s.push(`${r}:${t[l]};`);
                    }
                }
            } else if (l === "#text") {
                if (n.addText) {
                    B(e, t[l], n, a);
                }
            } else if (l === "&children") {
                if (n.addChildren) {
                    const i = t[l].length;
                    for (let s = 0; s < i; s++) {
                        const i = t[l][s];
                        for (const t in i) {
                            if (Object.prototype.hasOwnProperty.call(i, t)) {
                                const s = r.create(e, t.toLowerCase(), o);
                                D(s, i[t], n, a, null);
                            }
                        }
                    }
                }
            }
        }
        if (s.length > 0) {
            S(e, s, a);
        }
    }
    function B(e, t, n, r) {
        e.innerHTML = t;
        if (r.templateDataKeysLength > 0) {
            for (let t = 0; t < r.templateDataKeysLength; t++) {
                let a = r.templateDataKeys[t];
                if (Object.prototype.hasOwnProperty.call(n.templateData, a)) {
                    const t = n.templateData[a];
                    if (e.innerHTML.indexOf(a) > -1) {
                        e.innerHTML = i.replaceAll(e.innerHTML, a, t);
                        if (r.templateDataKeysProcessed.indexOf(a) === -1) {
                            r.templateDataKeysProcessed.push(a);
                        }
                    } else {
                        a = `${a.replace("}}", "")}${" "}${"|"}`;
                        const n = e.innerHTML.indexOf(a);
                        if (n > -1) {
                            const r = e.innerHTML.indexOf("}}", n);
                            if (r > -1) {
                                const a = e.innerHTML.substring(n, r + "}}".length);
                                e.innerHTML = i.replaceAll(e.innerHTML, a, t);
                            }
                        }
                    }
                }
            }
        }
    }
    function S(e, n, r) {
        let i;
        if (t.definedString(e.className)) {
            const t = e.className.split(" ");
            i = `${e.nodeName.toLowerCase()}.${t[0]} {`;
        } else {
            if (!t.definedString(e.id)) {
                e.id = crypto.randomUUID();
            }
            i = `#${e.id} {`;
        }
        let a = [];
        a.push(i);
        a = a.concat(n);
        a.push("}");
        r.css[e.id] = a;
    }
    function v(e) {
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
    function H() {
        const e = [].slice.call(document.getElementsByTagName("styles"));
        const t = e.length;
        for (let n = 0; n < t; n++) {
            e[n].parentNode.removeChild(e[n]);
        }
    }
    function L(e) {
        const t = e.templateDataKeysProcessed.length;
        if (e.templateDataKeysLength > t) {
            for (let t = 0; t < e.templateDataKeysLength; t++) {
                const n = e.templateDataKeys[t];
                if (e.templateDataKeysProcessed.indexOf(n) === -1) {
                    console.warn(d.text.variableWarningText.replace("{{variable_name}}", n));
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
    const w = {
        json: () => {
            const e = g();
            const t = {
                includeAttributes: r => {
                    e.includeAttributes = n.getBoolean(r, e.includeAttributes);
                    return t;
                },
                includeDataAttributes: r => {
                    e.includeDataAttributes = n.getBoolean(r, e.includeDataAttributes);
                    return t;
                },
                includeCssProperties: r => {
                    e.includeCssProperties = n.getBoolean(r, e.includeCssProperties);
                    return t;
                },
                includeText: r => {
                    e.includeText = n.getBoolean(r, e.includeText);
                    return t;
                },
                includeChildren: r => {
                    e.includeChildren = n.getBoolean(r, e.includeChildren);
                    return t;
                },
                includeImagesAsBase64: r => {
                    e.includeImagesAsBase64 = n.getBoolean(r, e.includeImagesAsBase64);
                    return t;
                },
                friendlyFormat: r => {
                    e.friendlyFormat = n.getBoolean(r, e.friendlyFormat);
                    return t;
                },
                indentSpaces: r => {
                    e.indentSpaces = n.getNumber(r, e.indentSpaces);
                    return t;
                },
                ignoreNodeTypes: r => {
                    e.ignoreNodeTypes = n.getStringOrArray(r, e.ignoreNodeTypes);
                    return t;
                },
                ignoreNodeCondition: r => {
                    e.ignoreNodeCondition = n.getFunction(r, e.ignoreNodeCondition);
                    return t;
                },
                ignoreCssProperties: r => {
                    e.ignoreCssProperties = n.getStringOrArray(r, e.ignoreCssProperties);
                    return t;
                },
                ignoreAttributes: r => {
                    e.ignoreAttributes = n.getStringOrArray(r, e.ignoreAttributes);
                    return t;
                },
                ignoreElementIds: r => {
                    e.ignoreElementIds = n.getStringOrArray(r, e.ignoreElementIds);
                    return t;
                },
                generateUniqueMissingIds: r => {
                    e.generateUniqueMissingIds = n.getBoolean(r, e.generateUniqueMissingIds);
                    return t;
                },
                generateUniqueMissingNames: r => {
                    e.generateUniqueMissingNames = n.getBoolean(r, e.generateUniqueMissingNames);
                    return t;
                },
                propertyReplacer: r => {
                    e.propertyReplacer = n.getFunction(r, e.propertyReplacer);
                    return t;
                },
                get: t => p(t, e),
                getVariables: e => i.getTemplateVariables(e)
            };
            return t;
        },
        html: function() {
            const e = C();
            const r = {
                json: t => {
                    e.json = n.getString(t, e.json);
                    return r;
                },
                templateData: t => {
                    e.templateData = n.getObject(t, e.templateData);
                    return r;
                },
                removeOriginalAttributes: t => {
                    e.removeOriginalAttributes = n.getBoolean(t, e.removeOriginalAttributes);
                    return r;
                },
                removeOriginalDataAttributes: t => {
                    e.removeOriginalDataAttributes = n.getBoolean(t, e.removeOriginalDataAttributes);
                    return r;
                },
                clearOriginalHTML: t => {
                    e.clearOriginalHTML = n.getBoolean(t, e.clearOriginalHTML);
                    return r;
                },
                addCssToHead: t => {
                    e.addCssToHead = n.getBoolean(t, e.addCssToHead);
                    return r;
                },
                clearCssFromHead: t => {
                    e.clearCssFromHead = n.getBoolean(t, e.clearCssFromHead);
                    return r;
                },
                logTemplateDataWarnings: t => {
                    e.logTemplateDataWarnings = n.getBoolean(t, e.logTemplateDataWarnings);
                    return r;
                },
                addAttributes: t => {
                    e.addAttributes = n.getBoolean(t, e.addAttributes);
                    return r;
                },
                addDataAttributes: t => {
                    e.addDataAttributes = n.getBoolean(t, e.addDataAttributes);
                    return r;
                },
                addCssProperties: t => {
                    e.addCssProperties = n.getBoolean(t, e.addCssProperties);
                    return r;
                },
                addText: t => {
                    e.addText = n.getBoolean(t, e.addText);
                    return r;
                },
                addChildren: t => {
                    e.addChildren = n.getBoolean(t, e.addChildren);
                    return r;
                },
                insertBefore: t => {
                    e.insertBefore = n.getBoolean(t, e.insertBefore);
                    return r;
                },
                write: t => x(t, e),
                get: () => N(e),
                getVariables: e => {
                    let n = [];
                    if (t.definedObject(e)) {
                        n = i.getTemplateVariables(e.innerHTML);
                    }
                    return n;
                }
            };
            return r;
        },
        render: (e, n) => {
            if (t.definedObject(e) && t.definedObject(n)) {
                f(o.Options.getForNewInstance(n, e, C()));
            }
            return w;
        },
        renderAll: () => {
            c();
            return w;
        },
        setConfiguration: e => {
            if (t.definedObject(e)) {
                const t = d;
                let n = false;
                for (const r in e) {
                    if (Object.prototype.hasOwnProperty.call(e, r) && Object.prototype.hasOwnProperty.call(t, r) && t[r] !== e[r]) {
                        t[r] = e[r];
                        n = true;
                    }
                }
                if (n) {
                    d = a.Options.get(t);
                }
            }
            return w;
        },
        getVersion: () => "2.4.1"
    };
    (() => {
        d = a.Options.get();
        l.onContentLoaded(() => c());
        if (!t.defined(window.$jhson)) {
            window.$jhson = w;
        }
    })();
})();//# sourceMappingURL=jhson.js.map