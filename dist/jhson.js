/*! JHson.js v1.0.0 | (c) Bunoon 2024 | MIT License */
(function() {
  function getJSON(element, properties) {
    var result = _string.empty;
    if (isDefinedObject(element)) {
      var resultJson = {};
      var elementJson = getElementObject(element, properties, {});
      resultJson[elementJson.nodeName] = elementJson.nodeValues;
      if (properties.friendlyFormat) {
        result = _parameter_JSON.stringify(resultJson, null, properties.indentSpaces);
      } else {
        result = _parameter_JSON.stringify(resultJson);
      }
    }
    return result;
  }
  function getElementObject(element, properties, parentCssStyles) {
    var result = {};
    var childrenLength = element.children.length;
    var childrenAdded = 0;
    if (properties.includeAttributes) {
      getElementAttributes(element, result, properties);
    }
    if (properties.includeCssProperties) {
      getElementCssProperties(element, result, properties, parentCssStyles);
    }
    if (properties.includeChildren && childrenLength > 0) {
      childrenAdded = getElementChildren(element, result, childrenLength, properties, parentCssStyles);
    }
    if (properties.includeText) {
      getElementText(element, result, childrenAdded);
    }
    if (isDefined(result[_json.children]) && result[_json.children].length === 0) {
      delete result[_json.children];
    }
    return {nodeName:element.nodeName.toLowerCase(), nodeValues:result};
  }
  function getElementAttributes(element, result, properties) {
    var attributesLength = element.attributes.length;
    var attributesAvailable = [];
    if (properties.includeText && element.nodeName.toLowerCase() === "textarea" && isDefined(element.value)) {
      result[_json.text] = element.value;
    }
    var attributeIndex = 0;
    for (; attributeIndex < attributesLength; attributeIndex++) {
      var attribute = element.attributes[attributeIndex];
      if (isDefinedString(attribute.nodeName) && properties.ignoreAttributes.indexOf(attribute.nodeName) === _value.notFound) {
        result[_json.attribute + attribute.nodeName] = attribute.nodeValue;
        attributesAvailable.push(attribute.nodeName);
      }
    }
    if (properties.generateUniqueMissingIds && attributesAvailable.indexOf("id") === _value.notFound && properties.ignoreAttributes.indexOf("id") === _value.notFound) {
      result[_json.attribute + "id"] = newGuid();
    }
  }
  function getElementCssProperties(element, result, properties, parentCssStyles) {
    if (_parameter_Window.getComputedStyle) {
      var cssComputedStyles = _parameter_Document.defaultView.getComputedStyle(element);
      var cssComputedStylesLength = cssComputedStyles.length;
      var cssComputedStyleIndex = 0;
      for (; cssComputedStyleIndex < cssComputedStylesLength; cssComputedStyleIndex++) {
        var cssComputedStyleName = cssComputedStyles[cssComputedStyleIndex];
        if (properties.ignoreCssProperties.indexOf(cssComputedStyleName) === _value.notFound) {
          var cssComputedStyleNameStorage = _json.cssStyle + cssComputedStyleName;
          var cssComputedValue = cssComputedStyles.getPropertyValue(cssComputedStyleName);
          if (!parentCssStyles.hasOwnProperty(cssComputedStyleNameStorage) || parentCssStyles[cssComputedStyleNameStorage] !== cssComputedValue) {
            result[cssComputedStyleNameStorage] = cssComputedValue;
            parentCssStyles[cssComputedStyleNameStorage] = result[cssComputedStyleNameStorage];
          }
        }
      }
    }
  }
  function getElementChildren(element, result, childrenLength, properties, parentCssStyles) {
    var totalChildren = 0;
    result[_json.children] = [];
    var childrenIndex = 0;
    for (; childrenIndex < childrenLength; childrenIndex++) {
      var child = element.children[childrenIndex];
      var childElementData = getElementObject(child, properties, getParentCssStylesCopy(parentCssStyles));
      var addChild = false;
      if (_configuration.formattingNodeTypes.indexOf(childElementData.nodeName) > _value.notFound) {
        totalChildren++;
      } else {
        if (properties.ignoreNodeTypes.indexOf(childElementData.nodeName) === _value.notFound) {
          addChild = true;
          totalChildren++;
        }
      }
      if (addChild) {
        var childJson = {};
        childJson[childElementData.nodeName] = childElementData.nodeValues;
        result[_json.children].push(childJson);
      }
    }
    return totalChildren;
  }
  function getElementText(element, result, childrenAdded) {
    if (isDefinedString(element.innerText)) {
      if (childrenAdded > 0 && isDefined(result[_json.children]) && result[_json.children].length === 0) {
        result[_json.text] = element.innerHTML;
      } else {
        if (element.innerText.trim() === element.innerHTML.trim()) {
          result[_json.text] = element.innerText;
        }
      }
    }
  }
  function getParentCssStylesCopy(parentCssStyles) {
    var copy = {};
    var cssStyleName;
    for (cssStyleName in parentCssStyles) {
      if (parentCssStyles.hasOwnProperty(cssStyleName)) {
        copy[cssStyleName] = parentCssStyles[cssStyleName];
      }
    }
    return copy;
  }
  function writeHtml(element, properties) {
    var writingScope = {css:{}, templateDataKeys:[], templateDataKeysLength:0, templateDataKeysProcessed:[]};
    if (isDefinedObject(element) && isDefinedString(properties.json)) {
      var convertedJsonObject = getObjectFromString(properties.json);
      if (properties.clearCssFromHead) {
        clearCssStyleTagsFromHead();
      }
      if (isDefinedObject(properties.templateData)) {
        setupWritingScopeTemplateDataKeys(properties, writingScope);
      }
      if (convertedJsonObject.parsed && isDefinedObject(convertedJsonObject.result)) {
        var key;
        for (key in convertedJsonObject.result) {
          if (key === element.nodeName.toLowerCase()) {
            if (properties.removeOriginalAttributes) {
              for (; element.attributes.length > 0;) {
                element.removeAttribute(element.attributes[0].name);
              }
            }
            if (properties.clearOriginalHTML) {
              element.innerHTML = _string.empty;
            }
            writeNode(element, convertedJsonObject.result[key], properties, writingScope);
          }
        }
      }
      if (properties.addCssToHead) {
        writeCssStyleTag(writingScope);
      }
      if (properties.logTemplateDataWarnings) {
        checkedForUnusedTemplateData(writingScope);
      }
    }
    return _this;
  }
  function setupWritingScopeTemplateDataKeys(properties, writingScope) {
    var templateDataKey;
    for (templateDataKey in properties.templateData) {
      if (properties.templateData.hasOwnProperty(templateDataKey)) {
        writingScope.templateDataKeys.push(templateDataKey);
      }
    }
    writingScope.templateDataKeys = writingScope.templateDataKeys.sort(function(a, b) {
      return b.length - a.length;
    });
    writingScope.templateDataKeysLength = writingScope.templateDataKeys.length;
  }
  function writeNode(element, jsonObject, properties, writingScope) {
    var cssStyles = [];
    var jsonKey;
    for (jsonKey in jsonObject) {
      if (startsWithAnyCase(jsonKey, _json.attribute)) {
        if (properties.addAttributes) {
          var attributeName = jsonKey.replace(_json.attribute, _string.empty);
          var attributeValue = jsonObject[jsonKey];
          element.setAttribute(attributeName, attributeValue);
        }
      } else if (startsWithAnyCase(jsonKey, _json.cssStyle)) {
        if (properties.addCssProperties) {
          var cssStyleName = jsonKey.replace(_json.cssStyle, _string.empty);
          if (!properties.addCssToHead) {
            element.style[cssStyleName] = jsonObject[jsonKey];
          } else {
            cssStyles.push(cssStyleName + ":" + jsonObject[jsonKey] + ";");
          }
        }
      } else if (jsonKey === _json.text) {
        if (properties.addText) {
          writeElementTextAndTemplateData(element, jsonObject[jsonKey], properties, writingScope);
        }
      } else if (jsonKey === _json.children) {
        if (properties.addChildren) {
          var childrenLength = jsonObject[jsonKey].length;
          var childrenIndex = 0;
          for (; childrenIndex < childrenLength; childrenIndex++) {
            var childJson = jsonObject[jsonKey][childrenIndex];
            var childJsonKey;
            for (childJsonKey in childJson) {
              if (childJson.hasOwnProperty(childJsonKey)) {
                var childElement = createElement(element, childJsonKey.toLowerCase());
                writeNode(childElement, childJson[childJsonKey], properties, writingScope);
              }
            }
          }
        }
      }
    }
    if (cssStyles.length > 0) {
      storeCssStyles(element, cssStyles, writingScope);
    }
  }
  function writeElementTextAndTemplateData(element, value, properties, writingScope) {
    element.innerHTML = value;
    if (writingScope.templateDataKeysLength > 0) {
      var templateDataKeyIndex = 0;
      for (; templateDataKeyIndex < writingScope.templateDataKeysLength; templateDataKeyIndex++) {
        var templateDataKey = writingScope.templateDataKeys[templateDataKeyIndex];
        if (properties.templateData.hasOwnProperty(templateDataKey) && element.innerHTML.indexOf(templateDataKey) > _value.notFound) {
          element.innerHTML = replaceAll(element.innerHTML, templateDataKey, properties.templateData[templateDataKey]);
          if (writingScope.templateDataKeysProcessed.indexOf(templateDataKey) === _value.notFound) {
            writingScope.templateDataKeysProcessed.push(templateDataKey);
          }
        }
      }
    }
  }
  function storeCssStyles(element, cssStyles, writingScope) {
    var identifier = null;
    if (isDefinedString(element.className)) {
      var classNameParts = element.className.split(_string.space);
      identifier = element.nodeName.toLowerCase() + "." + classNameParts[0] + " {";
    } else {
      if (!isDefinedString(element.id)) {
        element.id = newGuid();
      }
      identifier = "#" + element.id + " {";
    }
    var cssLines = [];
    cssLines.push(identifier);
    cssLines = cssLines.concat(cssStyles);
    cssLines.push("}");
    writingScope.css[element.id] = cssLines;
  }
  function writeCssStyleTag(writingScope) {
    var head = _parameter_Document.getElementsByTagName("head")[0];
    var cssLines = [];
    var elementId;
    for (elementId in writingScope.css) {
      if (writingScope.css.hasOwnProperty(elementId)) {
        cssLines = cssLines.concat(writingScope.css[elementId]);
      }
    }
    var style = createElement(head, "style");
    style.type = "text/css";
    style.appendChild(_parameter_Document.createTextNode(cssLines.join(_string.newLine)));
  }
  function clearCssStyleTagsFromHead() {
    var styles = [].slice.call(_parameter_Document.getElementsByTagName("styles"));
    var stylesLength = styles.length;
    var styleIndex = 0;
    for (; styleIndex < stylesLength; styleIndex++) {
      styles[styleIndex].parentNode.removeChild(styles[styleIndex]);
    }
  }
  function checkedForUnusedTemplateData(writingScope) {
    var templateDataKeysProcessedLength = writingScope.templateDataKeysProcessed.length;
    if (writingScope.templateDataKeysLength > templateDataKeysProcessedLength) {
      var templateDataKeyIndex = 0;
      for (; templateDataKeyIndex < writingScope.templateDataKeysLength; templateDataKeyIndex++) {
        var templateDataKey = writingScope.templateDataKeys[templateDataKeyIndex];
        if (writingScope.templateDataKeysProcessed.indexOf(templateDataKey) === _value.notFound) {
          console.warn(_configuration.variableWarningText.replace("{{variable_name}}", templateDataKey));
        }
      }
    }
  }
  function getTemplateVariables(data) {
    var result = [];
    if (isDefinedString(data)) {
      var startIndex = 0;
      var endIndex = 0;
      for (; startIndex > _value.notFound;) {
        startIndex = data.indexOf("{{", endIndex);
        if (startIndex > _value.notFound) {
          endIndex = data.indexOf("}}", startIndex);
          if (endIndex > _value.notFound) {
            var variable = data.substring(startIndex, endIndex + 2);
            result.push(variable);
            endIndex = endIndex + 2;
          }
        }
      }
    }
    return result;
  }
  function createElement(container, type) {
    var nodeType = type.toLowerCase();
    var isText = nodeType === "text";
    if (!_elements_Type.hasOwnProperty(nodeType)) {
      _elements_Type[nodeType] = isText ? _parameter_Document.createTextNode(_string.empty) : _parameter_Document.createElement(nodeType);
    }
    var result = _elements_Type[nodeType].cloneNode(false);
    container.appendChild(result);
    return result;
  }
  function isDefined(value) {
    return value !== null && value !== undefined && value !== _string.empty;
  }
  function isDefinedObject(object) {
    return isDefined(object) && typeof object === "object";
  }
  function isDefinedBoolean(object) {
    return isDefined(object) && typeof object === "boolean";
  }
  function isDefinedString(object) {
    return isDefined(object) && typeof object === "string";
  }
  function isDefinedFunction(object) {
    return isDefined(object) && typeof object === "function";
  }
  function isDefinedNumber(object) {
    return isDefined(object) && typeof object === "number";
  }
  function isDefinedArray(object) {
    return isDefinedObject(object) && object instanceof Array;
  }
  function newGuid() {
    var result = [];
    var charIndex = 0;
    for (; charIndex < 32; charIndex++) {
      if (charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20) {
        result.push(_string.dash);
      }
      var character = _parameter_Math.floor(_parameter_Math.random() * 16).toString(16);
      result.push(character);
    }
    return result.join(_string.empty);
  }
  function startsWithAnyCase(data, start) {
    return data.substring(0, start.length).toLowerCase() === start.toLowerCase();
  }
  function replaceAll(string, find, replace) {
    return string.replace(new RegExp(find, "g"), replace);
  }
  function getDefaultBoolean(value, defaultValue) {
    return isDefinedBoolean(value) ? value : defaultValue;
  }
  function getDefaultNumber(value, defaultValue) {
    return isDefinedNumber(value) ? value : defaultValue;
  }
  function getDefaultString(value, defaultValue) {
    return isDefinedString(value) ? value : defaultValue;
  }
  function getDefaultArray(value, defaultValue) {
    return isDefinedArray(value) ? value : defaultValue;
  }
  function getDefaultObject(value, defaultValue) {
    return isDefinedObject(value) ? value : defaultValue;
  }
  function getDefaultStringOrArray(value, defaultValue) {
    if (isDefinedString(value)) {
      value = value.split(_string.space);
      if (value.length === 0) {
        value = defaultValue;
      }
    } else {
      value = getDefaultArray(value, defaultValue);
    }
    return value;
  }
  function getObjectFromString(objectString) {
    var parsed = true;
    var result = null;
    try {
      if (isDefinedString(objectString)) {
        result = _parameter_JSON.parse(objectString);
      }
    } catch (e1) {
      try {
        result = eval("(" + objectString + ")");
        if (isDefinedFunction(result)) {
          result = result();
        }
      } catch (e2) {
        if (!_configuration.safeMode) {
          console.error(_configuration.objectErrorText.replace("{{error_1}}", e1.message).replace("{{error_2}}", e2.message));
          parsed = false;
        }
        result = null;
      }
    }
    return {parsed:parsed, result:result};
  }
  function buildDefaultConfiguration(newConfiguration) {
    _configuration = !isDefinedObject(newConfiguration) ? {} : newConfiguration;
    _configuration.safeMode = getDefaultBoolean(_configuration.safeMode, true);
    _configuration.formattingNodeTypes = getDefaultStringOrArray(_configuration.formattingNodeTypes, ["b", "strong", "i", "em", "mark", "small", "del", "ins", "sub", "sup"]);
    buildDefaultConfigurationStrings();
  }
  function buildDefaultConfigurationStrings() {
    _configuration.variableWarningText = getDefaultString(_configuration.variableWarningText, "Template variable {{variable_name}} not found.");
    _configuration.objectErrorText = getDefaultString(_configuration.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
  }
  var _this = this;
  var _parameter_Document = null;
  var _parameter_Window = null;
  var _parameter_JSON = null;
  var _parameter_Math = null;
  var _configuration = {};
  var _elements_Type = {};
  var _string = {empty:"", space:" ", newLine:"\n"};
  var _json = {text:"#text", cssStyle:"$", attribute:"@", children:"&children"};
  var _value = {notFound:-1};
  this.json = function() {
    var jsonScope = null;
    (function() {
      jsonScope = this;
      var __properties = {includeAttributes:true, includeCssProperties:false, includeText:true, includeChildren:true, friendlyFormat:true, indentSpaces:2, ignoreNodeTypes:[], ignoreCssProperties:[], ignoreAttributes:[], generateUniqueMissingIds:false};
      jsonScope.includeAttributes = function(flag) {
        __properties.includeAttributes = getDefaultBoolean(flag, __properties.includeAttributes);
        return jsonScope;
      };
      jsonScope.includeCssProperties = function(flag) {
        __properties.includeCssProperties = getDefaultBoolean(flag, __properties.includeCssProperties);
        return jsonScope;
      };
      jsonScope.includeText = function(flag) {
        __properties.includeText = getDefaultBoolean(flag, __properties.includeText);
        return jsonScope;
      };
      jsonScope.includeChildren = function(flag) {
        __properties.includeChildren = getDefaultBoolean(flag, __properties.includeChildren);
        return jsonScope;
      };
      jsonScope.friendlyFormat = function(flag) {
        __properties.friendlyFormat = getDefaultBoolean(flag, __properties.friendlyFormat);
        return jsonScope;
      };
      jsonScope.indentSpaces = function(spaces) {
        __properties.indentSpaces = getDefaultNumber(spaces, __properties.indentSpaces);
        return jsonScope;
      };
      jsonScope.ignoreNodeTypes = function(types) {
        __properties.ignoreNodeTypes = getDefaultStringOrArray(types, __properties.ignoreNodeTypes);
        return jsonScope;
      };
      jsonScope.ignoreCssProperties = function(properties) {
        __properties.ignoreCssProperties = getDefaultStringOrArray(properties, __properties.ignoreCssProperties);
        return jsonScope;
      };
      jsonScope.ignoreAttributes = function(attributes) {
        __properties.ignoreAttributes = getDefaultStringOrArray(attributes, __properties.ignoreAttributes);
        return jsonScope;
      };
      jsonScope.generateUniqueMissingIds = function(flag) {
        __properties.generateUniqueMissingIds = getDefaultBoolean(flag, __properties.generateUniqueMissingIds);
        return jsonScope;
      };
      jsonScope.get = function(element) {
        return getJSON(element, __properties);
      };
      jsonScope.getVariables = function(json) {
        return getTemplateVariables(json);
      };
    })();
    return jsonScope;
  };
  this.html = function() {
    var htmlScope = null;
    (function() {
      htmlScope = this;
      var __properties = {json:_string.empty, templateData:{}, removeOriginalAttributes:true, clearOriginalHTML:true, addCssToHead:false, clearCssFromHead:false, logTemplateDataWarnings:false, addAttributes:true, addCssProperties:true, addText:true, addChildren:true};
      htmlScope.json = function(json) {
        __properties.json = getDefaultString(json, __properties.json);
        return htmlScope;
      };
      htmlScope.templateData = function(templateData) {
        __properties.templateData = getDefaultObject(templateData, __properties.templateData);
        return htmlScope;
      };
      htmlScope.removeOriginalAttributes = function(flag) {
        __properties.removeOriginalAttributes = getDefaultBoolean(flag, __properties.removeOriginalAttributes);
        return htmlScope;
      };
      htmlScope.clearOriginalHTML = function(flag) {
        __properties.clearOriginalHTML = getDefaultBoolean(flag, __properties.clearOriginalHTML);
        return htmlScope;
      };
      htmlScope.addCssToHead = function(flag) {
        __properties.addCssToHead = getDefaultBoolean(flag, __properties.addCssToHead);
        return htmlScope;
      };
      htmlScope.clearCssFromHead = function(flag) {
        __properties.clearCssFromHead = getDefaultBoolean(flag, __properties.clearCssFromHead);
        return htmlScope;
      };
      htmlScope.logTemplateDataWarnings = function(flag) {
        __properties.logTemplateDataWarnings = getDefaultBoolean(flag, __properties.logTemplateDataWarnings);
        return htmlScope;
      };
      htmlScope.addAttributes = function(flag) {
        __properties.addAttributes = getDefaultBoolean(flag, __properties.addAttributes);
        return htmlScope;
      };
      htmlScope.addCssProperties = function(flag) {
        __properties.addCssProperties = getDefaultBoolean(flag, __properties.addCssProperties);
        return htmlScope;
      };
      htmlScope.addText = function(flag) {
        __properties.addText = getDefaultBoolean(flag, __properties.addText);
        return htmlScope;
      };
      htmlScope.addChildren = function(flag) {
        __properties.addChildren = getDefaultBoolean(flag, __properties.addChildren);
        return htmlScope;
      };
      htmlScope.write = function(element) {
        return writeHtml(element, __properties);
      };
      htmlScope.getVariables = function(element) {
        var result = [];
        if (isDefinedObject(element)) {
          result = getTemplateVariables(element.innerHTML);
        }
        return result;
      };
    })();
    return htmlScope;
  };
  this.setConfiguration = function(newConfiguration) {
    var configurationChanges = false;
    var propertyName;
    for (propertyName in newConfiguration) {
      if (newConfiguration.hasOwnProperty(propertyName) && _configuration.hasOwnProperty(propertyName) && newConfiguration[propertyName] !== _configuration[propertyName]) {
        _configuration[propertyName] = newConfiguration[propertyName];
        configurationChanges = true;
      }
    }
    if (configurationChanges) {
      buildDefaultConfiguration(_configuration);
    }
    return this;
  };
  this.getVersion = function() {
    return "1.0.0";
  };
  (function(documentObject, windowObject, jsonObject, mathObject) {
    _parameter_Document = documentObject;
    _parameter_Window = windowObject;
    _parameter_JSON = jsonObject;
    _parameter_Math = mathObject;
    buildDefaultConfiguration();
    if (!isDefined(_parameter_Window.$jhson)) {
      _parameter_Window.$jhson = this;
    }
  })(document, window, JSON, Math);
})();