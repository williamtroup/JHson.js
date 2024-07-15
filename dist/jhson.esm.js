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
        })(Is || (Is = {}));
    }
});

var Data;

var init_data = __esm({
    "src/ts/data.ts"() {
        "use strict";
        init_enum();
        init_is();
        (e => {
            let t;
            (e => {
                function t() {
                    const e = [];
                    for (let t = 0; t < 32; t++) {
                        if (t === 8 || t === 12 || t === 16 || t === 20) {
                            e.push("-");
                        }
                        const n = Math.floor(Math.random() * 16).toString(16);
                        e.push(n);
                    }
                    return e.join("");
                }
                e.newGuid = t;
                function n(e, t) {
                    return e.substring(0, t.length).toLowerCase() === t.toLowerCase();
                }
                e.startsWithAnyCase = n;
                function r(e, t, n) {
                    return e.replace(new RegExp(t.replace("|", `[${"|"}]`), "g"), n);
                }
                e.replaceAll = r;
                function i(e) {
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
                e.getTemplateVariables = i;
            })(t = e.String || (e.String = {}));
            function n(e, t) {
                return typeof e === "string" ? e : t;
            }
            e.getDefaultAnyString = n;
            function r(e, t) {
                return Is.definedString(e) ? e : t;
            }
            e.getDefaultString = r;
            function i(e, t) {
                return Is.definedBoolean(e) ? e : t;
            }
            e.getDefaultBoolean = i;
            function o(e, t) {
                return Is.definedNumber(e) ? e : t;
            }
            e.getDefaultNumber = o;
            function a(e, t) {
                return Is.definedFunction(e) ? e : t;
            }
            e.getDefaultFunction = a;
            function s(e, t) {
                return Is.definedArray(e) ? e : t;
            }
            e.getDefaultArray = s;
            function l(e, t) {
                return Is.definedObject(e) ? e : t;
            }
            e.getDefaultObject = l;
            function c(e, t) {
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
            e.getDefaultStringOrArray = c;
        })(Data || (Data = {}));
    }
});

var DomElement;

var init_dom = __esm({
    "src/ts/dom.ts"() {
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

var require_jhson = __commonJS({
    "src/jhson.ts"(exports, module) {
        init_constant();
        init_data();
        init_dom();
        init_enum();
        init_is();
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
                    var n = e.getAttribute(Constant.JHSON_JS_ATTRIBUTE_NAME);
                    if (Is.definedString(n)) {
                        var r = getObjectFromString(n);
                        if (r.parsed && Is.definedObject(r.object)) {
                            renderElement(renderBindingOptions(r.object, e));
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
            function renderBindingOptions(e, t) {
                const n = buildAttributeOptions(e);
                n._currentView.element = t;
                return n;
            }
            function renderElement(e) {
                fireCustomTriggerEvent(e.events.onBeforeRender, e._currentView.element);
                const t = getDefaultHtmlProperties();
                t.json = e.json;
                writeHtml(e._currentView.element, t);
                fireCustomTriggerEvent(e.events.onRenderComplete, e._currentView.element);
            }
            function buildAttributeOptions(e) {
                let t = Data.getDefaultObject(e, {});
                const n = getDefaultHtmlProperties();
                t.json = Data.getDefaultString(t.json, n.json);
                t.templateData = Data.getDefaultObject(t.templateData, n.templateData);
                t.removeOriginalAttributes = Data.getDefaultBoolean(t.removeOriginalAttributes, n.removeOriginalAttributes);
                t.clearOriginalHTML = Data.getDefaultBoolean(t.clearOriginalHTML, n.clearOriginalHTML);
                t.addCssToHead = Data.getDefaultBoolean(t.addCssToHead, n.addCssToHead);
                t.clearCssFromHead = Data.getDefaultBoolean(t.clearCssFromHead, n.clearCssFromHead);
                t.logTemplateDataWarnings = Data.getDefaultBoolean(t.logTemplateDataWarnings, n.logTemplateDataWarnings);
                t.addAttributes = Data.getDefaultBoolean(t.addAttributes, n.addAttributes);
                t.addCssProperties = Data.getDefaultBoolean(t.addCssProperties, n.addCssProperties);
                t.addText = Data.getDefaultBoolean(t.addText, n.addText);
                t.addChildren = Data.getDefaultBoolean(t.addChildren, n.addChildren);
                t = buildAttributeOptionCustomTriggers(t);
                return t;
            }
            function buildAttributeOptionCustomTriggers(e) {
                e.events.onBeforeRender = Data.getDefaultFunction(e.events.onBeforeRender, null);
                e.events.onRenderComplete = Data.getDefaultFunction(e.events.onRenderComplete, null);
                return e;
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
                let o = 0;
                if (t.includeAttributes) {
                    getElementAttributes(e, r, t);
                }
                if (t.includeCssProperties) {
                    getElementCssProperties(e, r, t, n);
                }
                if (t.includeChildren && i > 0) {
                    o = getElementChildren(e, r, i, t, n);
                }
                if (t.includeText) {
                    getElementText(e, r, o);
                }
                if (Is.defined(r["&children"]) && r["&children"].length === 0) {
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
                for (let o = 0; o < r; o++) {
                    const r = e.attributes[o];
                    if (Is.definedString(r.nodeName) && n.ignoreAttributes.indexOf(r.nodeName) === -1) {
                        t["@" + r.nodeName] = r.nodeValue;
                        i.push(r.nodeName);
                    }
                }
                if (n.generateUniqueMissingIds && i.indexOf("id") === -1 && n.ignoreAttributes.indexOf("id") === -1) {
                    t["@" + "id"] = Data.String.newGuid();
                }
            }
            function getElementCssProperties(e, t, n, r) {
                const i = getComputedStyle(e);
                const o = i.length;
                for (let e = 0; e < o; e++) {
                    const o = i[e];
                    if (n.ignoreCssProperties.indexOf(o) === -1) {
                        const e = "$" + o;
                        const n = i.getPropertyValue(o);
                        if (!r.hasOwnProperty(e) || r[e] !== n) {
                            t[e] = n;
                            r[e] = t[e];
                        }
                    }
                }
            }
            function getElementChildren(e, t, n, r, i) {
                let o = 0;
                t["&children"] = [];
                for (let a = 0; a < n; a++) {
                    const n = e.children[a];
                    const s = getElementObject(n, r, getParentCssStylesCopy(i));
                    let l = false;
                    if (_configuration.formattingNodeTypes.indexOf(s.nodeName) > -1) {
                        o++;
                    } else {
                        if (r.ignoreNodeTypes.indexOf(s.nodeName) === -1) {
                            l = true;
                            o++;
                        }
                    }
                    if (l) {
                        const e = {};
                        e[s.nodeName] = s.nodeValues;
                        t["&children"].push(e);
                    }
                }
                return o;
            }
            function getElementText(e, t, n) {
                if (Is.definedString(e.innerText)) {
                    if (n > 0 && Is.defined(t["&children"]) && t["&children"].length === 0) {
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
                for (let o in t) {
                    if (Data.String.startsWithAnyCase(o, "@")) {
                        if (n.addAttributes) {
                            const n = o.replace("@", "");
                            const r = t[o];
                            e.setAttribute(n, r);
                        }
                    } else if (Data.String.startsWithAnyCase(o, "$")) {
                        if (n.addCssProperties) {
                            const r = o.replace("$", "");
                            if (!n.addCssToHead) {
                                e.style.setProperty(r, t[o]);
                            } else {
                                i.push(r + ":" + t[o] + ";");
                            }
                        }
                    } else if (o === "#text") {
                        if (n.addText) {
                            writeElementTextAndTemplateData(e, t[o], n, r);
                        }
                    } else if (o === "&children") {
                        if (n.addChildren) {
                            const i = t[o].length;
                            for (let a = 0; a < i; a++) {
                                const i = t[o][a];
                                for (let t in i) {
                                    if (i.hasOwnProperty(t)) {
                                        const o = DomElement.create(e, t.toLowerCase());
                                        writeNode(o, i[t], n, r);
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
                                e.innerHTML = Data.String.replaceAll(e.innerHTML, i, t);
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
                                        e.innerHTML = Data.String.replaceAll(e.innerHTML, i, t);
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
                    r = e.nodeName.toLowerCase() + "." + t[0] + " {";
                } else {
                    if (!Is.definedString(e.id)) {
                        e.id = Data.String.newGuid();
                    }
                    r = "#" + e.id + " {";
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
                const t = Data.String.getTemplateVariables(e.innerHTML);
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
                    const e = {
                        includeAttributes: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        includeCssProperties: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        includeText: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        includeChildren: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        friendlyFormat: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        indentSpaces: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        ignoreNodeTypes: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        ignoreCssProperties: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        ignoreAttributes: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        generateUniqueMissingIds: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        get: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        getVariables: function(e) {
                            throw new Error("Function not implemented.");
                        }
                    };
                    return e;
                },
                html: function() {
                    const e = {
                        json: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        templateData: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        removeOriginalAttributes: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        clearOriginalHTML: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        addCssToHead: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        clearCssFromHead: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        logTemplateDataWarnings: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        addAttributes: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        addCssProperties: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        addText: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        addChildren: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        write: function(e) {
                            throw new Error("Function not implemented.");
                        },
                        getVariables: function(e) {
                            throw new Error("Function not implemented.");
                        }
                    };
                    return e;
                },
                setConfiguration: function(e) {
                    throw new Error("Function not implemented.");
                },
                getVersion: function() {
                    throw new Error("Function not implemented.");
                }
            };
            (() => {})();
        })();
    }
});

export default require_jhson();//# sourceMappingURL=jhson.esm.js.map