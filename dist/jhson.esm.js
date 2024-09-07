var __getOwnPropNames = Object.getOwnPropertyNames;

var __esm = (e, t) => function n() {
    return e && (t = (0, e[__getOwnPropNames(e)[0]])(e = 0)), t;
};

var __commonJS = (e, t) => function n() {
    return t || (0, e[__getOwnPropNames(e)[0]])((t = {
        exports: {}
    }).exports, t), t.exports;
};

var Constant;

var init_constant = __esm({
    "src/ts/constant.ts"() {
        "use strict";
        (e => {
            e.JHSON_JS_ATTRIBUTE_NAME = "data-jhson-js";
        })(Constant || (Constant = {}));
    }
});

var init_enum = __esm({
    "src/ts/data/enum.ts"() {
        "use strict";
    }
});

var Is;

var init_is = __esm({
    "src/ts/data/is.ts"() {
        "use strict";
        init_enum();
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
            function s(e) {
                return t(e) && typeof e === "number";
            }
            e.definedNumber = s;
            function o(e) {
                return n(e) && e instanceof Array;
            }
            e.definedArray = o;
        })(Is || (Is = {}));
    }
});

var Default;

var init_default = __esm({
    "src/ts/data/default.ts"() {
        "use strict";
        init_enum();
        init_is();
        (e => {
            function t(e, t) {
                return typeof e === "string" ? e : t;
            }
            e.getDefaultAnyString = t;
            function n(e, t) {
                return Is.definedString(e) ? e : t;
            }
            e.getDefaultString = n;
            function r(e, t) {
                return Is.definedBoolean(e) ? e : t;
            }
            e.getDefaultBoolean = r;
            function i(e, t) {
                return Is.definedNumber(e) ? e : t;
            }
            e.getDefaultNumber = i;
            function a(e, t) {
                return Is.definedFunction(e) ? e : t;
            }
            e.getDefaultFunction = a;
            function s(e, t) {
                return Is.definedArray(e) ? e : t;
            }
            e.getDefaultArray = s;
            function o(e, t) {
                return Is.definedObject(e) ? e : t;
            }
            e.getDefaultObject = o;
            function l(e, t) {
                let n = t;
                if (Is.definedString(e)) {
                    const r = e.toString().split(" ");
                    if (r.length === 0) {
                        e = t;
                    } else {
                        n = r;
                    }
                } else {
                    n = s(e, t);
                }
                return n;
            }
            e.getDefaultStringOrArray = l;
        })(Default || (Default = {}));
    }
});

var DomElement;

var init_dom = __esm({
    "src/ts/dom/dom.ts"() {
        "use strict";
        init_enum();
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
    }
});

var Str;

var init_str = __esm({
    "src/ts/data/str.ts"() {
        "use strict";
        init_enum();
        init_is();
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
    }
});

var Config;

var init_config = __esm({
    "src/ts/options/config.ts"() {
        "use strict";
        init_default();
        (e => {
            let t;
            (e => {
                function t(e = null) {
                    let t = Default.getDefaultObject(e, {});
                    t.safeMode = Default.getDefaultBoolean(t.safeMode, true);
                    t.domElementTypes = Default.getDefaultStringOrArray(t.domElementTypes, [ "*" ]);
                    t.formattingNodeTypes = Default.getDefaultStringOrArray(t.formattingNodeTypes, [ "b", "strong", "i", "em", "mark", "small", "del", "ins", "sub", "sup" ]);
                    t = n(t);
                    return t;
                }
                e.get = t;
                function n(e) {
                    e.text = Default.getDefaultObject(e.text, {});
                    e.text.variableWarningText = Default.getDefaultString(e.text.variableWarningText, "Template variable {{variable_name}} not found.");
                    e.text.objectErrorText = Default.getDefaultString(e.text.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
                    e.text.attributeNotValidErrorText = Default.getDefaultString(e.text.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
                    e.text.attributeNotSetErrorText = Default.getDefaultString(e.text.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
                    return e;
                }
            })(t = e.Options || (e.Options = {}));
        })(Config || (Config = {}));
    }
});

var Binding;

var init_binding = __esm({
    "src/ts/options/binding.ts"() {
        "use strict";
        init_default();
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
                    let n = Default.getDefaultObject(e, {});
                    n.json = Default.getDefaultString(n.json, t.json);
                    n.templateData = Default.getDefaultObject(n.templateData, t.templateData);
                    n.removeOriginalAttributes = Default.getDefaultBoolean(n.removeOriginalAttributes, t.removeOriginalAttributes);
                    n.clearOriginalHTML = Default.getDefaultBoolean(n.clearOriginalHTML, t.clearOriginalHTML);
                    n.addCssToHead = Default.getDefaultBoolean(n.addCssToHead, t.addCssToHead);
                    n.clearCssFromHead = Default.getDefaultBoolean(n.clearCssFromHead, t.clearCssFromHead);
                    n.logTemplateDataWarnings = Default.getDefaultBoolean(n.logTemplateDataWarnings, t.logTemplateDataWarnings);
                    n.addAttributes = Default.getDefaultBoolean(n.addAttributes, t.addAttributes);
                    n.addCssProperties = Default.getDefaultBoolean(n.addCssProperties, t.addCssProperties);
                    n.addText = Default.getDefaultBoolean(n.addText, t.addText);
                    n.addChildren = Default.getDefaultBoolean(n.addChildren, t.addChildren);
                    n = r(n);
                    return n;
                }
                e.get = n;
                function r(e) {
                    e.events = Default.getDefaultObject(e.events, {});
                    e.events.onBeforeRender = Default.getDefaultFunction(e.events.onBeforeRender, null);
                    e.events.onRenderComplete = Default.getDefaultFunction(e.events.onRenderComplete, null);
                    return e;
                }
            })(t = e.Options || (e.Options = {}));
        })(Binding || (Binding = {}));
    }
});

var require_jhson = __commonJS({
    "src/jhson.ts"(exports, module) {
        init_constant();
        init_default();
        init_dom();
        init_enum();
        init_is();
        init_str();
        init_config();
        init_binding();
        (() => {
            let _configuration = {};
            function render() {
                const e = _configuration.domElementTypes;
                const t = e.length;
                for (let n = 0; n < t; n++) {
                    const t = document.getElementsByTagName(e[n]);
                    const r = [].slice.call(t);
                    const i = r.length;
                    for (let e = 0; e < i; e++) {
                        if (!renderBindingElement(r[e])) {
                            break;
                        }
                    }
                }
            }
            function renderBindingElement(e) {
                let t = true;
                if (Is.defined(e) && e.hasAttribute(Constant.JHSON_JS_ATTRIBUTE_NAME)) {
                    let n = e.getAttribute(Constant.JHSON_JS_ATTRIBUTE_NAME);
                    if (Is.definedString(n)) {
                        const r = getObjectFromString(n);
                        if (r.parsed && Is.definedObject(r.object)) {
                            renderElement(Binding.Options.getForNewInstance(r.object, e, getDefaultHtmlProperties()));
                        } else {
                            if (!_configuration.safeMode) {
                                console.error(_configuration.text.attributeNotValidErrorText.replace("{{attribute_name}}", Constant.JHSON_JS_ATTRIBUTE_NAME));
                                t = false;
                            }
                        }
                    } else {
                        if (!_configuration.safeMode) {
                            console.error(_configuration.text.attributeNotSetErrorText.replace("{{attribute_name}}", Constant.JHSON_JS_ATTRIBUTE_NAME));
                            t = false;
                        }
                    }
                }
                return t;
            }
            function renderElement(e) {
                fireCustomTriggerEvent(e.events.onBeforeRender, e._currentView.element);
                const t = getDefaultHtmlProperties();
                t.json = e.json;
                writeHtml(e._currentView.element, t);
                fireCustomTriggerEvent(e.events.onRenderComplete, e._currentView.element);
            }
            function getDefaultJsonProperties() {
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
            function getJSON(e, t) {
                let n = "";
                if (Is.definedObject(e)) {
                    const r = {};
                    const i = getElementObject(e, t, {});
                    r[i.nodeName] = i.nodeValues;
                    if (t.friendlyFormat) {
                        n = JSON.stringify(r, null, t.indentSpaces);
                    } else {
                        n = JSON.stringify(r);
                    }
                }
                return n;
            }
            function getElementObject(e, t, n) {
                const r = {};
                const i = e.children.length;
                let a = 0;
                if (t.includeAttributes) {
                    getElementAttributes(e, r, t);
                }
                if (t.includeCssProperties) {
                    getElementCssProperties(e, r, t, n);
                }
                if (t.includeChildren && i > 0) {
                    a = getElementChildren(e, r, i, t, n);
                }
                if (t.includeText) {
                    getElementText(e, r, a);
                }
                if (r.hasOwnProperty("&children") && r["&children"].length === 0) {
                    delete r["&children"];
                }
                return {
                    nodeName: e.nodeName.toLowerCase(),
                    nodeValues: r
                };
            }
            function getElementAttributes(e, t, n) {
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
            function getElementCssProperties(e, t, n, r) {
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
            function getElementChildren(e, t, n, r, i) {
                let a = 0;
                t["&children"] = [];
                for (let s = 0; s < n; s++) {
                    const n = e.children[s];
                    const o = getElementObject(n, r, getParentCssStylesCopy(i));
                    let l = false;
                    if (_configuration.formattingNodeTypes.indexOf(o.nodeName) > -1) {
                        a++;
                    } else {
                        if (r.ignoreNodeTypes.indexOf(o.nodeName) === -1) {
                            l = true;
                            a++;
                        }
                    }
                    if (l) {
                        const e = {};
                        e[o.nodeName] = o.nodeValues;
                        t["&children"].push(e);
                    }
                }
                return a;
            }
            function getElementText(e, t, n) {
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
            function getParentCssStylesCopy(e) {
                const t = {};
                for (let n in e) {
                    if (e.hasOwnProperty(n)) {
                        t[n] = e[n];
                    }
                }
                return t;
            }
            function getDefaultHtmlProperties() {
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
            function writeHtml(e, t) {
                if (Is.definedObject(e) && Is.definedString(t.json)) {
                    const n = getObjectFromString(t.json);
                    const r = {
                        css: {},
                        templateDataKeys: [],
                        templateDataKeysLength: 0,
                        templateDataKeysProcessed: []
                    };
                    if (n.parsed && Is.definedObject(n.object)) {
                        if (t.clearCssFromHead) {
                            clearCssStyleTagsFromHead();
                        }
                        if (Is.definedObject(t.templateData)) {
                            setupWritingScopeTemplateDataKeys(t, r);
                        }
                        for (let i in n.object) {
                            if (i === e.nodeName.toLowerCase()) {
                                if (t.removeOriginalAttributes) {
                                    while (e.attributes.length > 0) {
                                        e.removeAttribute(e.attributes[0].name);
                                    }
                                }
                                if (t.clearOriginalHTML) {
                                    e.innerHTML = "";
                                }
                                writeNode(e, n.object[i], t, r);
                            }
                        }
                        processRemainingVariablesForDefaults(e);
                        if (t.addCssToHead) {
                            writeCssStyleTag(r);
                        }
                        if (t.logTemplateDataWarnings) {
                            checkedForUnusedTemplateData(r);
                        }
                    }
                }
                return _public;
            }
            function setupWritingScopeTemplateDataKeys(e, t) {
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
            function writeNode(e, t, n, r) {
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
                            writeElementTextAndTemplateData(e, t[a], n, r);
                        }
                    } else if (a === "&children") {
                        if (n.addChildren) {
                            const i = t[a].length;
                            for (let s = 0; s < i; s++) {
                                const i = t[a][s];
                                for (let t in i) {
                                    if (i.hasOwnProperty(t)) {
                                        const a = DomElement.create(e, t.toLowerCase());
                                        writeNode(a, i[t], n, r);
                                    }
                                }
                            }
                        }
                    }
                }
                if (i.length > 0) {
                    storeCssStyles(e, i, r);
                }
            }
            function writeElementTextAndTemplateData(e, t, n, r) {
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
            function storeCssStyles(e, t, n) {
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
            function writeCssStyleTag(e) {
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
            function clearCssStyleTagsFromHead() {
                const e = [].slice.call(document.getElementsByTagName("styles"));
                const t = e.length;
                for (let n = 0; n < t; n++) {
                    e[n].parentNode.removeChild(e[n]);
                }
            }
            function checkedForUnusedTemplateData(e) {
                const t = e.templateDataKeysProcessed.length;
                if (e.templateDataKeysLength > t) {
                    for (let t = 0; t < e.templateDataKeysLength; t++) {
                        const n = e.templateDataKeys[t];
                        if (e.templateDataKeysProcessed.indexOf(n) === -1) {
                            console.warn(_configuration.text.variableWarningText.replace("{{variable_name}}", n));
                        }
                    }
                }
            }
            function processRemainingVariablesForDefaults(e) {
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
            const _public = {
                json: function() {
                    const e = getDefaultJsonProperties();
                    const t = {
                        includeAttributes: function(t) {
                            e.includeAttributes = Default.getDefaultBoolean(t, e.includeAttributes);
                            return this;
                        },
                        includeCssProperties: function(t) {
                            e.includeCssProperties = Default.getDefaultBoolean(t, e.includeCssProperties);
                            return this;
                        },
                        includeText: function(t) {
                            e.includeText = Default.getDefaultBoolean(t, e.includeText);
                            return this;
                        },
                        includeChildren: function(t) {
                            e.includeChildren = Default.getDefaultBoolean(t, e.includeChildren);
                            return this;
                        },
                        friendlyFormat: function(t) {
                            e.friendlyFormat = Default.getDefaultBoolean(t, e.friendlyFormat);
                            return this;
                        },
                        indentSpaces: function(t) {
                            e.indentSpaces = Default.getDefaultNumber(t, e.indentSpaces);
                            return this;
                        },
                        ignoreNodeTypes: function(t) {
                            e.ignoreNodeTypes = Default.getDefaultStringOrArray(t, e.ignoreNodeTypes);
                            return this;
                        },
                        ignoreCssProperties: function(t) {
                            e.ignoreCssProperties = Default.getDefaultStringOrArray(t, e.ignoreCssProperties);
                            return this;
                        },
                        ignoreAttributes: function(t) {
                            e.ignoreAttributes = Default.getDefaultStringOrArray(t, e.ignoreAttributes);
                            return this;
                        },
                        generateUniqueMissingIds: function(t) {
                            e.generateUniqueMissingIds = Default.getDefaultBoolean(t, e.generateUniqueMissingIds);
                            return this;
                        },
                        get: function(t) {
                            return getJSON(t, e);
                        },
                        getVariables: function(e) {
                            return Str.getTemplateVariables(e);
                        }
                    };
                    return t;
                },
                html: function() {
                    const e = getDefaultHtmlProperties();
                    const t = {
                        json: function(n) {
                            e.json = Default.getDefaultString(n, e.json);
                            return t;
                        },
                        templateData: function(n) {
                            e.templateData = Default.getDefaultObject(n, e.templateData);
                            return t;
                        },
                        removeOriginalAttributes: function(n) {
                            e.removeOriginalAttributes = Default.getDefaultBoolean(n, e.removeOriginalAttributes);
                            return t;
                        },
                        clearOriginalHTML: function(n) {
                            e.clearOriginalHTML = Default.getDefaultBoolean(n, e.clearOriginalHTML);
                            return t;
                        },
                        addCssToHead: function(n) {
                            e.addCssToHead = Default.getDefaultBoolean(n, e.addCssToHead);
                            return t;
                        },
                        clearCssFromHead: function(n) {
                            e.clearCssFromHead = Default.getDefaultBoolean(n, e.clearCssFromHead);
                            return t;
                        },
                        logTemplateDataWarnings: function(n) {
                            e.logTemplateDataWarnings = Default.getDefaultBoolean(n, e.logTemplateDataWarnings);
                            return t;
                        },
                        addAttributes: function(n) {
                            e.addAttributes = Default.getDefaultBoolean(n, e.addAttributes);
                            return t;
                        },
                        addCssProperties: function(n) {
                            e.addCssProperties = Default.getDefaultBoolean(n, e.addCssProperties);
                            return t;
                        },
                        addText: function(n) {
                            e.addText = Default.getDefaultBoolean(n, e.addText);
                            return t;
                        },
                        addChildren: function(n) {
                            e.addChildren = Default.getDefaultBoolean(n, e.addChildren);
                            return t;
                        },
                        write: function(t) {
                            return writeHtml(t, e);
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
                setConfiguration: function(e) {
                    if (Is.definedObject(e)) {
                        let t = false;
                        const n = _configuration;
                        for (let r in e) {
                            if (e.hasOwnProperty(r) && _configuration.hasOwnProperty(r) && n[r] !== e[r]) {
                                n[r] = e[r];
                                t = true;
                            }
                        }
                        if (t) {
                            _configuration = Config.Options.get(n);
                        }
                    }
                    return _public;
                },
                getVersion: function() {
                    return "2.1.0";
                }
            };
            (() => {
                _configuration = Config.Options.get();
                document.addEventListener("DOMContentLoaded", (function() {
                    render();
                }));
                if (!Is.defined(window.$jhson)) {
                    window.$jhson = _public;
                }
            })();
        })();
    }
});

export default require_jhson();//# sourceMappingURL=jhson.esm.js.map