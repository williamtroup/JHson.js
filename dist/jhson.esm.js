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
            if (t.length === 0) {
                e = n;
            } else {
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
            const a = r.getAttribute(e.JHSON_JS_ATTRIBUTE_NAME);
            if (t.definedString(a)) {
                const s = n.getObjectFromString(a, l);
                if (s.parsed && t.definedObject(s.object)) {
                    u(o.Options.getForNewInstance(s.object, r, A()));
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
            generateUniqueMissingIds: false,
            generateUniqueMissingNames: false,
            propertyReplacer: null
        };
    }
    function f(e, n) {
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
        let a = 0;
        if (t.includeAttributes) {
            m(e, r, t);
        }
        if (t.includeCssProperties) {
            b(e, r, t, n);
        }
        if (t.includeChildren && i > 0) {
            a = T(e, r, i, t, n);
        }
        if (t.includeText) {
            O(e, r, a);
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
                            n[t] = y(e);
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
    function b(e, t, n, r) {
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
            const d = p(r, i, h(a));
            let c = false;
            if (l.formattingNodeTypes.indexOf(d.nodeName) > -1) {
                o++;
            } else {
                if (i.ignoreNodeTypes.indexOf(d.nodeName) === -1) {
                    if (!t.definedFunction(i.ignoreNodeCondition) || !i.ignoreNodeCondition(r)) {
                        c = true;
                        o++;
                    }
                }
            }
            if (c) {
                const e = {};
                e[d.nodeName] = d.nodeValues;
                n["&children"].push(e);
            }
        }
        return o;
    }
    function O(e, n, r) {
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
    function h(e) {
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
            const a = n.getObjectFromString(e.json, l);
            for (const e in a.object) {
                i = r.createWithNoContainer(e);
                break;
            }
            if (t.defined(i)) {
                N(i, e, a);
            }
        }
        return i;
    }
    function N(e, r, i = null) {
        if (t.definedObject(e) && t.definedString(r.json)) {
            let a = i;
            if (!t.definedObject(a)) {
                a = n.getObjectFromString(r.json, l);
            }
            const o = {
                css: {},
                templateDataKeys: [],
                templateDataKeysLength: 0,
                templateDataKeysProcessed: []
            };
            if (a.parsed && t.definedObject(a.object)) {
                if (r.clearCssFromHead) {
                    v();
                }
                if (t.definedObject(r.templateData)) {
                    x(r, o);
                }
                for (const t in a.object) {
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
                        j(e, a.object[t], r, o);
                        break;
                    }
                }
                M(e);
                if (r.addCssToHead) {
                    S(o);
                }
                if (r.logTemplateDataWarnings) {
                    H(o);
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
    function j(e, t, n, a) {
        const o = [];
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
                        o.push(`${r}:${t[s]};`);
                    }
                }
            } else if (s === "#text") {
                if (n.addText) {
                    D(e, t[s], n, a);
                }
            } else if (s === "&children") {
                if (n.addChildren) {
                    const i = t[s].length;
                    for (let o = 0; o < i; o++) {
                        const i = t[s][o];
                        for (const t in i) {
                            if (Object.prototype.hasOwnProperty.call(i, t)) {
                                const o = r.create(e, t.toLowerCase());
                                j(o, i[t], n, a);
                            }
                        }
                    }
                }
            }
        }
        if (o.length > 0) {
            B(e, o, a);
        }
    }
    function D(e, t, n, r) {
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
        let a = [];
        a.push(i);
        a = a.concat(n);
        a.push("}");
        r.css[e.id] = a;
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
                get: t => f(t, e),
                getVariables: e => i.getTemplateVariables(e)
            };
            return t;
        },
        html: function() {
            const e = A();
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
                write: t => N(t, e),
                get: () => C(e),
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
                u(o.Options.getForNewInstance(n, e, A()));
            }
            return L;
        },
        renderAll: () => {
            d();
            return L;
        },
        setConfiguration: e => {
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
                    l = a.Options.get(n);
                }
            }
            return L;
        },
        getVersion: () => "2.4.0"
    };
    (() => {
        l = a.Options.get();
        document.addEventListener("DOMContentLoaded", () => d());
        if (!t.defined(window.$jhson)) {
            window.$jhson = L;
        }
    })();
})();//# sourceMappingURL=jhson.esm.js.map