/*! JHson.js v0.3.0 | (c) Bunoon 2024 | MIT License */
(function() {
  function getJSON(element, properties) {
    var result = _string.empty;
    var resultJson = {};
    var elementJson = getElementObject(element, properties, {});
    resultJson[elementJson.nodeName] = elementJson.nodeValues;
    if (properties.friendlyFormat) {
      result = _parameter_JSON.stringify(resultJson, null, _configuration.jsonIndentationSpaces);
    } else {
      result = _parameter_JSON.stringify(resultJson);
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
          writeNode(element, convertedJsonObject.result[key], templateDataKeys, properties.templateData);
        }
      }
    }
    return _this;
  }
  function writeNode(element, jsonObject, templateDataKeys, templateData) {
    var templateDataKeysLength = templateDataKeys.length;
    var jsonKey;
    for (jsonKey in jsonObject) {
      if (startsWithAnyCase(jsonKey, _json.attribute)) {
        var attributeName = jsonKey.replace(_json.attribute, _string.empty);
        var attributeValue = jsonObject[jsonKey];
        element.setAttribute(attributeName, attributeValue);
      } else if (startsWithAnyCase(jsonKey, _json.cssStyle)) {
        var cssStyleName = jsonKey.replace(_json.cssStyle, _string.empty);
        var cssStyleValue = jsonObject[jsonKey];
        element.style[cssStyleName] = cssStyleValue;
      } else if (jsonKey === _json.text) {
        element.innerHTML = jsonObject[jsonKey];
        if (templateDataKeysLength > 0) {
          var templateDataKeyIndex = 0;
          for (; templateDataKeyIndex < templateDataKeysLength; templateDataKeyIndex++) {
            var templateDataKey = templateDataKeys[templateDataKeyIndex];
            if (templateData.hasOwnProperty(templateDataKey)) {
              element.innerHTML = replaceAll(element.innerHTML, templateDataKey, templateData[templateDataKey]);
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
              writeNode(childElement, childJson[childJsonKey], templateDataKeys, templateData);
            }
          }
        }
      }
    }
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
  var _configuration = {};
  var _elements_Type = {};
  var _string = {empty:"", space:" "};
  var _json = {text:"#text", cssStyle:"$", attribute:"@", children:"&children"};
  var _value = {notFound:-1};
  this.json = function() {
    var result = null;
    (function() {
      result = this;
      var __properties = {includeAttributes:true, includeCssStyles:false, includeText:true, includeChildren:true, friendlyFormat:true};
      this.includeAttributes = function(flag) {
        __properties.includeAttributes = getDefaultBoolean(flag, true);
        return this;
      };
      this.includeCssStyles = function(flag) {
        __properties.includeCssStyles = getDefaultBoolean(flag, false);
        return this;
      };
      this.includeText = function(flag) {
        __properties.includeText = getDefaultBoolean(flag, true);
        return this;
      };
      this.includeChildren = function(flag) {
        __properties.includeChildren = getDefaultBoolean(flag, true);
        return this;
      };
      this.friendlyFormat = function(flag) {
        __properties.friendlyFormat = getDefaultBoolean(flag, true);
        return this;
      };
      this.get = function(element) {
        return getJSON(element, __properties);
      };
    })();
    return result;
  };
  this.html = function() {
    var result = null;
    (function() {
      result = this;
      var __properties = {json:_string.empty, templateData:{}, removeAttributes:true, clearHTML:true};
      this.json = function(json) {
        __properties.json = json;
        return this;
      };
      this.templateData = function(templateData) {
        __properties.templateData = getDefaultObject(templateData, {});
        return this;
      };
      this.removeAttributes = function(flag) {
        __properties.removeAttributes = getDefaultBoolean(flag, true);
        return this;
      };
      this.clearHTML = function(flag) {
        __properties.clearHTML = getDefaultBoolean(flag, true);
        return this;
      };
      this.write = function(element) {
        return writeHtml(element, __properties);
      };
    })();
    return result;
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
    return "0.3.0";
  };
  (function(documentObject, windowObject, jsonObject) {
    _parameter_Document = documentObject;
    _parameter_Window = windowObject;
    _parameter_JSON = jsonObject;
    buildDefaultConfiguration();
    if (!isDefined(_parameter_Window.$jhson)) {
      _parameter_Window.$jhson = this;
    }
  })(document, window, JSON);
})();