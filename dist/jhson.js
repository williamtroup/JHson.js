/*! JHson.js v0.4.0 | (c) Bunoon 2024 | MIT License */
(function() {
  function getJSON(element, properties) {
    var result = _string.empty;
    if (isDefinedObject(element)) {
      var resultJson = {};
      var elementJson = getElementObject(element, properties, {});
      resultJson[elementJson.nodeName] = elementJson.nodeValues;
      if (properties.friendlyFormat) {
        result = _parameter_JSON.stringify(resultJson, null, _configuration.jsonIndentationSpaces);
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
      getElementAttributes(element, result);
    }
    if (properties.includeCssStyles) {
      getElementCssStyles(element, result, parentCssStyles);
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
  function getElementAttributes(element, result) {
    var attributesLength = element.attributes.length;
    if (element.nodeName.toLowerCase() === "textarea" && isDefined(element.value)) {
      result[_json.text] = element.value;
    }
    var attributeIndex = 0;
    for (; attributeIndex < attributesLength; attributeIndex++) {
      var attribute = element.attributes[attributeIndex];
      if (isDefinedString(attribute.nodeName)) {
        result[_json.attribute + attribute.nodeName] = attribute.nodeValue;
      }
    }
  }
  function getElementCssStyles(element, result, parentCssStyles) {
    if (_parameter_Window.getComputedStyle) {
      var cssComputedStyles = _parameter_Document.defaultView.getComputedStyle(element);
      var cssComputedStylesLength = cssComputedStyles.length;
      var cssComputedStyleIndex = 0;
      for (; cssComputedStyleIndex < cssComputedStylesLength; cssComputedStyleIndex++) {
        var cssComputedStyleName = cssComputedStyles[cssComputedStyleIndex];
        if (_configuration.cssPropertiesToIgnore.indexOf(cssComputedStyleName) === _value.notFound) {
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
      if (_configuration.formattingNodeTypes.indexOf(childElementData.nodeName.toLowerCase()) > _value.notFound) {
        totalChildren++;
      } else {
        if (_configuration.nodeTypesToIgnore.indexOf(childElementData.nodeName.toLowerCase()) === _value.notFound) {
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
        if (element.innerText === element.innerHTML) {
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
    if (isDefinedObject(element) && isDefinedString(properties.json)) {
      var convertedJsonObject = getObjectFromString(properties.json);
      var templateDataKeys = [];
      if (isDefinedObject(properties.templateData)) {
        var templateDataKey;
        for (templateDataKey in properties.templateData) {
          if (properties.templateData.hasOwnProperty(templateDataKey)) {
            templateDataKeys.push(templateDataKey);
          }
        }
        templateDataKeys = templateDataKeys.sort(function(a, b) {
          return b.length - a.length;
        });
      }
      if (convertedJsonObject.parsed && isDefinedObject(convertedJsonObject.result)) {
        var key;
        for (key in convertedJsonObject.result) {
          if (key === element.nodeName.toLowerCase()) {
            if (properties.removeAttributes) {
              for (; element.attributes.length > 0;) {
                element.removeAttribute(element.attributes[0].name);
              }
            }
            if (properties.clearHTML) {
              element.innerHTML = _string.empty;
            }
            writeNode(element, convertedJsonObject.result[key], templateDataKeys, properties);
          }
        }
      }
    }
    return _this;
  }
  function writeNode(element, jsonObject, templateDataKeys, properties) {
    var templateDataKeysLength = templateDataKeys.length;
    var cssStyles = [];
    var jsonKey;
    for (jsonKey in jsonObject) {
      if (startsWithAnyCase(jsonKey, _json.attribute)) {
        var attributeName = jsonKey.replace(_json.attribute, _string.empty);
        var attributeValue = jsonObject[jsonKey];
        element.setAttribute(attributeName, attributeValue);
      } else if (startsWithAnyCase(jsonKey, _json.cssStyle)) {
        var cssStyleName = jsonKey.replace(_json.cssStyle, _string.empty);
        if (!properties.addCssToHead) {
          element.style[cssStyleName] = jsonObject[jsonKey];
        } else {
          cssStyles.push(cssStyleName + ":" + jsonObject[jsonKey] + ";");
        }
      } else if (jsonKey === _json.text) {
        element.innerHTML = jsonObject[jsonKey];
        if (templateDataKeysLength > 0) {
          var templateDataKeyIndex = 0;
          for (; templateDataKeyIndex < templateDataKeysLength; templateDataKeyIndex++) {
            var templateDataKey = templateDataKeys[templateDataKeyIndex];
            if (properties.templateData.hasOwnProperty(templateDataKey)) {
              element.innerHTML = replaceAll(element.innerHTML, templateDataKey, properties.templateData[templateDataKey]);
            }
          }
        }
      } else if (jsonKey === _json.children) {
        var childrenLength = jsonObject[jsonKey].length;
        var childrenIndex = 0;
        for (; childrenIndex < childrenLength; childrenIndex++) {
          var childJson = jsonObject[jsonKey][childrenIndex];
          var childJsonKey;
          for (childJsonKey in childJson) {
            if (childJson.hasOwnProperty(childJsonKey)) {
              var childElement = createElement(element, childJsonKey.toLowerCase());
              writeNode(childElement, childJson[childJsonKey], templateDataKeys, properties);
            }
          }
        }
      }
    }
    if (cssStyles.length > 0) {
      writeCssStyleTag(element, cssStyles);
    }
  }
  function writeCssStyleTag(element, cssStyles) {
    var head = _parameter_Document.getElementsByTagName("head")[0];
    if (!isDefinedString(element.id)) {
      element.id = newGuid();
    }
    var cssLines = [];
    cssLines.push("#" + element.id + " {");
    cssLines = cssLines.concat(cssStyles);
    cssLines.push("}");
    var style = createElement(head, "style");
    style.type = "text/css";
    style.appendChild(_parameter_Document.createTextNode(cssLines.join(_string.newLine)));
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
          console.error("Errors in object: " + e1.message + ", " + e2.message);
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
    _configuration.nodeTypesToIgnore = getDefaultStringOrArray(_configuration.nodeTypesToIgnore, []);
    _configuration.cssPropertiesToIgnore = getDefaultStringOrArray(_configuration.cssPropertiesToIgnore, []);
    _configuration.jsonIndentationSpaces = getDefaultNumber(_configuration.jsonIndentationSpaces, 2);
    _configuration.formattingNodeTypes = getDefaultStringOrArray(_configuration.formattingNodeTypes, ["b", "strong", "i", "em", "mark", "small", "del", "ins", "sub", "sup"]);
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
    var scope = null;
    (function() {
      scope = this;
      var __properties = {includeAttributes:true, includeCssStyles:false, includeText:true, includeChildren:true, friendlyFormat:true};
      scope.includeAttributes = function(flag) {
        __properties.includeAttributes = getDefaultBoolean(flag, __properties.includeAttributes);
        return this;
      };
      scope.includeCssStyles = function(flag) {
        __properties.includeCssStyles = getDefaultBoolean(flag, __properties.includeCssStyles);
        return this;
      };
      scope.includeText = function(flag) {
        __properties.includeText = getDefaultBoolean(flag, __properties.includeText);
        return this;
      };
      scope.includeChildren = function(flag) {
        __properties.includeChildren = getDefaultBoolean(flag, __properties.includeChildren);
        return this;
      };
      scope.friendlyFormat = function(flag) {
        __properties.friendlyFormat = getDefaultBoolean(flag, __properties.friendlyFormat);
        return this;
      };
      scope.get = function(element) {
        return getJSON(element, __properties);
      };
    })();
    return scope;
  };
  this.html = function() {
    var scope = null;
    (function() {
      scope = this;
      var __properties = {json:_string.empty, templateData:{}, removeAttributes:true, clearHTML:true, addCssToHead:false};
      scope.json = function(json) {
        __properties.json = getDefaultString(json, __properties.json);
        return this;
      };
      scope.templateData = function(templateData) {
        __properties.templateData = getDefaultObject(templateData, __properties.templateData);
        return this;
      };
      scope.removeAttributes = function(flag) {
        __properties.removeAttributes = getDefaultBoolean(flag, __properties.removeAttributes);
        return this;
      };
      scope.clearHTML = function(flag) {
        __properties.clearHTML = getDefaultBoolean(flag, __properties.clearHTML);
        return this;
      };
      scope.addCssToHead = function(flag) {
        __properties.addCssToHead = getDefaultBoolean(flag, __properties.addCssToHead);
        return this;
      };
      scope.write = function(element) {
        return writeHtml(element, __properties);
      };
    })();
    return scope;
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
    return "0.4.0";
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