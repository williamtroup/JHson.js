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
        let r = n(t);
        e.appendChild(r);
        return r;
    }
    e.create = t;
    function n(e) {
        const t = e.toLowerCase();
        const n = t === "text";
        let r = n ? document.createTextNode("") : document.createElement(t);
        return r;
    }
    e.createWithNoContainer = n;
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
            n.removeOriginalDataAttributes = Default2.getBoolean(n.removeOriginalDataAttributes, t.removeOriginalDataAttributes);
            n.clearOriginalHTML = Default2.getBoolean(n.clearOriginalHTML, t.clearOriginalHTML);
            n.addCssToHead = Default2.getBoolean(n.addCssToHead, t.addCssToHead);
            n.clearCssFromHead = Default2.getBoolean(n.clearCssFromHead, t.clearCssFromHead);
            n.logTemplateDataWarnings = Default2.getBoolean(n.logTemplateDataWarnings, t.logTemplateDataWarnings);
            n.addAttributes = Default2.getBoolean(n.addAttributes, t.addAttributes);
            n.addDataAttributes = Default2.getBoolean(n.addDataAttributes, t.addDataAttributes);
            n.addCssProperties = Default2.getBoolean(n.addCssProperties, t.addCssProperties);
            n.addText = Default2.getBoolean(n.addText, t.addText);
            n.addChildren = Default2.getBoolean(n.addChildren, t.addChildren);
            n.insertBefore = Default2.getBoolean(n.insertBefore, t.insertBefore);
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
                    r(Binding.Options.getForNewInstance(a.object, t, g()));
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
        const t = g(e);
        p(e._currentView.element, t);
        Trigger.customEvent(e.events.onRenderComplete, e._currentView.element);
    }
    function i() {
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
    function a(e, t) {
        let n = "";
        if (Is.definedObject(e)) {
            const r = {};
            const i = o(e, t, {});
            r[i.nodeName] = i.nodeValues;
            if (t.friendlyFormat) {
                n = JSON.stringify(r, t.propertyReplacer, t.indentSpaces);
            } else {
                n = JSON.stringify(r, t.propertyReplacer);
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
                if (n.includeDataAttributes || !r.nodeName.startsWith("data-")) {
                    const a = `${"@"}${r.nodeName}`;
                    if (!n.includeCssProperties || r.nodeName !== "style") {
                        if (e.nodeName.toLowerCase() === "img" && r.nodeName === "src" && n.includeImagesAsBase64) {
                            t[a] = c(e);
                        } else {
                            t[a] = r.nodeValue;
                        }
                        i.push(r.nodeName);
                    }
                }
            }
        }
        if (n.generateUniqueMissingIds && i.indexOf("id") === -1 && n.ignoreAttributes.indexOf("id") === -1) {
            t[`${"@"}${"id"}`] = crypto.randomUUID();
        }
        if (n.generateUniqueMissingNames && i.indexOf("name") === -1 && n.ignoreAttributes.indexOf("name") === -1) {
            t[`${"@"}${"name"}`] = crypto.randomUUID();
        }
    }
    function l(e, t, n, r) {
        const i = getComputedStyle(e);
        const a = i.length;
        for (let e = 0; e < a; e++) {
            const a = i[e];
            if (n.ignoreCssProperties.indexOf(a) === -1) {
                const e = `${"$"}${a}`;
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
                    if (!Is.definedFunction(i.ignoreNodeCondition) || !i.ignoreNodeCondition(r)) {
                        d = true;
                        s++;
                    }
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
    function c(e) {
        const t = DomElement.createWithNoContainer("canvas");
        t.width = e.width;
        t.height = e.height;
        const n = t.getContext("2d");
        n.drawImage(e, 0, 0, e.width, e.height);
        const r = t.toDataURL();
        return r;
    }
    function g(e = null) {
        const t = Is.definedObject(e);
        return {
            json: t ? e.json : "",
            templateData: t ? e.templateData : {},
            removeOriginalAttributes: t ? e.removeOriginalAttributes : true,
            removeOriginalDataAttributes: t ? e.removeOriginalDataAttributes : true,
            clearOriginalHTML: t ? e.clearOriginalHTML : true,
            addCssToHead: t ? e.addCssToHead : false,
            clearCssFromHead: t ? e.clearCssFromHead : false,
            logTemplateDataWarnings: t ? e.logTemplateDataWarnings : false,
            addAttributes: t ? e.addAttributes : true,
            addDataAttributes: t ? e.addDataAttributes : true,
            addCssProperties: t ? e.addCssProperties : true,
            addText: t ? e.addText : true,
            addChildren: t ? e.addChildren : true,
            insertBefore: t ? e.insertBefore : false
        };
    }
    function m(t) {
        let n = null;
        if (Is.definedString(t.json)) {
            const r = Default2.getObjectFromString(t.json, e);
            for (let e in r.object) {
                n = DomElement.createWithNoContainer(e);
                break;
            }
            if (Is.defined(n)) {
                p(n, t, r);
            }
        }
        return n;
    }
    function p(t, n, r = null) {
        if (Is.definedObject(t) && Is.definedString(n.json)) {
            let i = r;
            if (!Is.definedObject(i)) {
                i = Default2.getObjectFromString(n.json, e);
            }
            const a = {
                css: {},
                templateDataKeys: [],
                templateDataKeysLength: 0,
                templateDataKeysProcessed: []
            };
            if (i.parsed && Is.definedObject(i.object)) {
                if (n.clearCssFromHead) {
                    C();
                }
                if (Is.definedObject(n.templateData)) {
                    b(n, a);
                }
                for (let e in i.object) {
                    if (e === t.nodeName.toLowerCase()) {
                        let r = null;
                        if (n.removeOriginalAttributes) {
                            let e = t.attributes.length;
                            while (e > 0) {
                                const r = t.attributes[0].name;
                                if (n.removeOriginalDataAttributes || !r.startsWith("data-")) {
                                    t.removeAttribute(r);
                                }
                                e--;
                            }
                        }
                        if (n.clearOriginalHTML) {
                            t.innerHTML = "";
                        } else if (n.insertBefore && t.children.length > 0) {
                            r = t.children[0];
                        }
                        D(t, i.object[e], n, a, r);
                        break;
                    }
                }
                y(t);
                if (n.addCssToHead) {
                    O(a);
                }
                if (n.logTemplateDataWarnings) {
                    A(a);
                }
            }
        }
        return N;
    }
    function b(e, t) {
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
    function D(e, t, n, r, i) {
        const a = [];
        for (let i in t) {
            if (Str.startsWithAnyCase(i, "@")) {
                if (n.addAttributes) {
                    const r = i.replace("@", "");
                    if (n.addDataAttributes || !r.startsWith("data-")) {
                        const n = t[i];
                        e.setAttribute(r, n);
                    }
                }
            } else if (Str.startsWithAnyCase(i, "$")) {
                if (n.addCssProperties) {
                    const r = i.replace("$", "");
                    if (!n.addCssToHead) {
                        e.style.setProperty(r, t[i]);
                    } else {
                        a.push(`${r}:${t[i]};`);
                    }
                }
            } else if (i === "#text") {
                if (n.addText) {
                    h(e, t[i], n, r);
                }
            } else if (i === "&children") {
                if (n.addChildren) {
                    const a = t[i].length;
                    for (let o = 0; o < a; o++) {
                        const a = t[i][o];
                        for (let t in a) {
                            if (a.hasOwnProperty(t)) {
                                const i = DomElement.create(e, t.toLowerCase());
                                D(i, a[t], n, r, null);
                            }
                        }
                    }
                }
            }
        }
        if (a.length > 0) {
            T(e, a, r);
        }
    }
    function h(e, t, n, r) {
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
                        i = `${i.replace("}}", "")}${" "}${"|"}`;
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
    function O(e) {
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
    function C() {
        const e = [].slice.call(document.getElementsByTagName("styles"));
        const t = e.length;
        for (let n = 0; n < t; n++) {
            e[n].parentNode.removeChild(e[n]);
        }
    }
    function A(t) {
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
    function y(e) {
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
    const N = {
        json: function() {
            const e = i();
            const t = {
                includeAttributes: function(t) {
                    e.includeAttributes = Default2.getBoolean(t, e.includeAttributes);
                    return this;
                },
                includeDataAttributes: function(t) {
                    e.includeDataAttributes = Default2.getBoolean(t, e.includeDataAttributes);
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
                includeImagesAsBase64: function(t) {
                    e.includeImagesAsBase64 = Default2.getBoolean(t, e.includeImagesAsBase64);
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
                ignoreNodeCondition: function(t) {
                    e.ignoreNodeCondition = Default2.getFunction(t, e.ignoreNodeCondition);
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
                generateUniqueMissingNames: function(t) {
                    e.generateUniqueMissingNames = Default2.getBoolean(t, e.generateUniqueMissingNames);
                    return this;
                },
                propertyReplacer: function(t) {
                    e.propertyReplacer = Default2.getFunction(t, e.propertyReplacer);
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
            const e = g();
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
                removeOriginalDataAttributes: function(n) {
                    e.removeOriginalDataAttributes = Default2.getBoolean(n, e.removeOriginalDataAttributes);
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
                addDataAttributes: function(n) {
                    e.addDataAttributes = Default2.getBoolean(n, e.addDataAttributes);
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
                insertBefore: function(n) {
                    e.insertBefore = Default2.getBoolean(n, e.insertBefore);
                    return t;
                },
                write: function(t) {
                    return p(t, e);
                },
                get: function() {
                    return m(e);
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
        render: function(e, t) {
            if (Is.definedObject(e) && Is.definedObject(t)) {
                r(Binding.Options.getForNewInstance(t, e, g()));
            }
            return N;
        },
        renderAll: function() {
            t();
            return N;
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
            return N;
        },
        getVersion: function() {
            return "2.3.0";
        }
    };
    (() => {
        e = Config.Options.get();
        document.addEventListener("DOMContentLoaded", (() => t()));
        if (!Is.defined(window.$jhson)) {
            window.$jhson = N;
        }
    })();
})();//# sourceMappingURL=jhson.esm.js.map