/*! JHson.js v2.0.0 | (c) Bunoon 2024 | MIT License */
(function() {
  var _parameter_Document = null, _parameter_Window = null, _parameter_JSON = null, _parameter_Math = null, _public = {}, _configuration = {}, _elements_Type = {}, _string = {empty:"", space:" ", newLine:"\n", variableStart:"{{", variableEnd:"}}", variableDefault:"|"}, _json = {text:"#text", cssStyle:"$", attribute:"@", children:"&children",}, _value = {notFound:-1}, _attribute_Name_Options = "data-jhson-js";
  function render() {
    var tagTypes = _configuration.domElementTypes, tagTypesLength = tagTypes.length;
    for (var tagTypeIndex = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++) {
      var domElements = _parameter_Document.getElementsByTagName(tagTypes[tagTypeIndex]), elements = [].slice.call(domElements), elementsLength = elements.length;
      for (var elementIndex = 0; elementIndex < elementsLength; elementIndex++) {
        if (!renderBindingElement(elements[elementIndex])) {
          break;
        }
      }
    }
  }
  function renderBindingElement(element) {
    var result = true;
    if (isDefined(element) && element.hasAttribute(_attribute_Name_Options)) {
      var bindingOptionsData = element.getAttribute(_attribute_Name_Options);
      if (isDefinedString(bindingOptionsData)) {
        var bindingOptions = getObjectFromString(bindingOptionsData);
        if (bindingOptions.parsed && isDefinedObject(bindingOptions.result)) {
          renderElement(renderBindingOptions(bindingOptions.result, element));
        } else {
          if (!_configuration.safeMode) {
            console.error(_configuration.attributeNotValidErrorText.replace("{{attribute_name}}", _attribute_Name_Options));
            result = false;
          }
        }
      } else {
        if (!_configuration.safeMode) {
          console.error(_configuration.attributeNotSetErrorText.replace("{{attribute_name}}", _attribute_Name_Options));
          result = false;
        }
      }
    }
    return result;
  }
  function renderBindingOptions(data, element) {
    var bindingOptions = buildAttributeOptions(data);
    bindingOptions.currentView = {};
    bindingOptions.currentView.element = element;
    return bindingOptions;
  }
  function renderElement(bindingOptions) {
    fireCustomTrigger(bindingOptions.onBeforeRender, bindingOptions.element);
    var properties = getDefaultHtmlProperties();
    properties.json = bindingOptions.json;
    writeHtml(bindingOptions.currentView.element, properties);
    fireCustomTrigger(bindingOptions.onRenderComplete, bindingOptions.element);
  }
  function buildAttributeOptions(newOptions) {
    var options = getDefaultObject(newOptions, {}), optionPropertyDefaults = getDefaultHtmlProperties();
    options.json = getDefaultString(options.json, optionPropertyDefaults.json);
    options.templateData = getDefaultObject(options.templateData, optionPropertyDefaults.templateData);
    options.removeOriginalAttributes = getDefaultBoolean(options.removeOriginalAttributes, optionPropertyDefaults.removeOriginalAttributes);
    options.clearOriginalHTML = getDefaultBoolean(options.clearOriginalHTML, optionPropertyDefaults.clearOriginalHTML);
    options.addCssToHead = getDefaultBoolean(options.addCssToHead, optionPropertyDefaults.addCssToHead);
    options.clearCssFromHead = getDefaultBoolean(options.clearCssFromHead, optionPropertyDefaults.clearCssFromHead);
    options.logTemplateDataWarnings = getDefaultBoolean(options.logTemplateDataWarnings, optionPropertyDefaults.logTemplateDataWarnings);
    options.addAttributes = getDefaultBoolean(options.addAttributes, optionPropertyDefaults.addAttributes);
    options.addCssProperties = getDefaultBoolean(options.addCssProperties, optionPropertyDefaults.addCssProperties);
    options.addText = getDefaultBoolean(options.addText, optionPropertyDefaults.addText);
    options.addChildren = getDefaultBoolean(options.addChildren, optionPropertyDefaults.addChildren);
    options = buildAttributeOptionCustomTriggers(options);
    return options;
  }
  function buildAttributeOptionCustomTriggers(options) {
    options.onBeforeRender = getDefaultFunction(options.onBeforeRender, null);
    options.onRenderComplete = getDefaultFunction(options.onRenderComplete, null);
    return options;
  }
  function getDefaultJsonProperties() {
    return {includeAttributes:true, includeCssProperties:false, includeText:true, includeChildren:true, friendlyFormat:true, indentSpaces:2, ignoreNodeTypes:[], ignoreCssProperties:[], ignoreAttributes:[], generateUniqueMissingIds:false};
  }
  function getJSON(element, properties) {
    var result = _string.empty;
    if (isDefinedObject(element)) {
      var resultJson = {}, elementJson = getElementObject(element, properties, {});
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
    var result = {}, childrenLength = element.children.length, childrenAdded = 0;
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
    var attributesLength = element.attributes.length, attributesAvailable = [];
    if (properties.includeText && element.nodeName.toLowerCase() === "textarea" && isDefined(element.value)) {
      result[_json.text] = element.value;
    }
    for (var attributeIndex = 0; attributeIndex < attributesLength; attributeIndex++) {
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
      var cssComputedStyles = _parameter_Document.defaultView.getComputedStyle(element), cssComputedStylesLength = cssComputedStyles.length;
      for (var cssComputedStyleIndex = 0; cssComputedStyleIndex < cssComputedStylesLength; cssComputedStyleIndex++) {
        var cssComputedStyleName = cssComputedStyles[cssComputedStyleIndex];
        if (properties.ignoreCssProperties.indexOf(cssComputedStyleName) === _value.notFound) {
          var cssComputedStyleNameStorage = _json.cssStyle + cssComputedStyleName, cssComputedValue = cssComputedStyles.getPropertyValue(cssComputedStyleName);
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
    for (var childrenIndex = 0; childrenIndex < childrenLength; childrenIndex++) {
      var child = element.children[childrenIndex], childElementData = getElementObject(child, properties, getParentCssStylesCopy(parentCssStyles)), addChild = false;
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
    for (var cssStyleName in parentCssStyles) {
      if (parentCssStyles.hasOwnProperty(cssStyleName)) {
        copy[cssStyleName] = parentCssStyles[cssStyleName];
      }
    }
    return copy;
  }
  function getDefaultHtmlProperties() {
    return {json:_string.empty, templateData:{}, removeOriginalAttributes:true, clearOriginalHTML:true, addCssToHead:false, clearCssFromHead:false, logTemplateDataWarnings:false, addAttributes:true, addCssProperties:true, addText:true, addChildren:true};
  }
  function writeHtml(element, properties) {
    if (isDefinedObject(element) && isDefinedString(properties.json)) {
      var convertedJsonObject = getObjectFromString(properties.json), writingScope = {css:{}, templateDataKeys:[], templateDataKeysLength:0, templateDataKeysProcessed:[]};
      if (convertedJsonObject.parsed && isDefinedObject(convertedJsonObject.result)) {
        if (properties.clearCssFromHead) {
          clearCssStyleTagsFromHead();
        }
        if (isDefinedObject(properties.templateData)) {
          setupWritingScopeTemplateDataKeys(properties, writingScope);
        }
        for (var key in convertedJsonObject.result) {
          if (key === element.nodeName.toLowerCase()) {
            if (properties.removeOriginalAttributes) {
              while (element.attributes.length > 0) {
                element.removeAttribute(element.attributes[0].name);
              }
            }
            if (properties.clearOriginalHTML) {
              element.innerHTML = _string.empty;
            }
            writeNode(element, convertedJsonObject.result[key], properties, writingScope);
          }
        }
        processRemainingVariablesForDefaults(element);
        if (properties.addCssToHead) {
          writeCssStyleTag(writingScope);
        }
        if (properties.logTemplateDataWarnings) {
          checkedForUnusedTemplateData(writingScope);
        }
      }
    }
    return _public;
  }
  function setupWritingScopeTemplateDataKeys(properties, writingScope) {
    for (var templateDataKey in properties.templateData) {
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
    for (var jsonKey in jsonObject) {
      if (startsWithAnyCase(jsonKey, _json.attribute)) {
        if (properties.addAttributes) {
          var attributeName = jsonKey.replace(_json.attribute, _string.empty), attributeValue = jsonObject[jsonKey];
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
          for (var childrenIndex = 0; childrenIndex < childrenLength; childrenIndex++) {
            var childJson = jsonObject[jsonKey][childrenIndex];
            for (var childJsonKey in childJson) {
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
      for (var templateDataKeyIndex = 0; templateDataKeyIndex < writingScope.templateDataKeysLength; templateDataKeyIndex++) {
        var templateDataKey = writingScope.templateDataKeys[templateDataKeyIndex];
        if (properties.templateData.hasOwnProperty(templateDataKey)) {
          var templateDataKeyReplacement = properties.templateData[templateDataKey];
          if (element.innerHTML.indexOf(templateDataKey) > _value.notFound) {
            element.innerHTML = replaceAll(element.innerHTML, templateDataKey, templateDataKeyReplacement);
            if (writingScope.templateDataKeysProcessed.indexOf(templateDataKey) === _value.notFound) {
              writingScope.templateDataKeysProcessed.push(templateDataKey);
            }
          } else {
            templateDataKey = templateDataKey.replace(_string.variableEnd, _string.empty) + _string.space + _string.variableDefault;
            var startIndex = element.innerHTML.indexOf(templateDataKey);
            if (startIndex > _value.notFound) {
              var endIndex = element.innerHTML.indexOf(_string.variableEnd, startIndex);
              if (endIndex > _value.notFound) {
                var variable = element.innerHTML.substring(startIndex, endIndex + _string.variableEnd.length);
                element.innerHTML = replaceAll(element.innerHTML, variable, templateDataKeyReplacement);
              }
            }
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
    var head = _parameter_Document.getElementsByTagName("head")[0], cssLines = [];
    for (var elementId in writingScope.css) {
      if (writingScope.css.hasOwnProperty(elementId)) {
        cssLines = cssLines.concat(writingScope.css[elementId]);
      }
    }
    var style = createElement(head, "style");
    style.type = "text/css";
    style.appendChild(_parameter_Document.createTextNode(cssLines.join(_string.newLine)));
  }
  function clearCssStyleTagsFromHead() {
    var styles = [].slice.call(_parameter_Document.getElementsByTagName("styles")), stylesLength = styles.length;
    for (var styleIndex = 0; styleIndex < stylesLength; styleIndex++) {
      styles[styleIndex].parentNode.removeChild(styles[styleIndex]);
    }
  }
  function checkedForUnusedTemplateData(writingScope) {
    var templateDataKeysProcessedLength = writingScope.templateDataKeysProcessed.length;
    if (writingScope.templateDataKeysLength > templateDataKeysProcessedLength) {
      for (var templateDataKeyIndex = 0; templateDataKeyIndex < writingScope.templateDataKeysLength; templateDataKeyIndex++) {
        var templateDataKey = writingScope.templateDataKeys[templateDataKeyIndex];
        if (writingScope.templateDataKeysProcessed.indexOf(templateDataKey) === _value.notFound) {
          console.warn(_configuration.variableWarningText.replace("{{variable_name}}", templateDataKey));
        }
      }
    }
  }
  function processRemainingVariablesForDefaults(element) {
    var remainingVariables = getTemplateVariables(element.innerHTML), remainingVariablesLength = remainingVariables.length;
    for (var remainingVariableIndex = 0; remainingVariableIndex < remainingVariablesLength; remainingVariableIndex++) {
      var variable = remainingVariables[remainingVariableIndex];
      if (variable.indexOf(_string.variableDefault) > _value.notFound) {
        var defaultValue = variable.replace(_string.variableStart, _string.empty).replace(_string.variableEnd, _string.empty).split(_string.variableDefault)[1];
        if (isDefinedString(defaultValue)) {
          element.innerHTML = element.innerHTML.replace(variable, defaultValue.trim());
        }
      }
    }
  }
  function getTemplateVariables(data) {
    var result = [];
    if (isDefinedString(data)) {
      var startIndex = 0, endIndex = 0;
      while (startIndex > _value.notFound) {
        startIndex = data.indexOf(_string.variableStart, endIndex);
        if (startIndex > _value.notFound) {
          endIndex = data.indexOf(_string.variableEnd, startIndex);
          if (endIndex > _value.notFound) {
            var variable = data.substring(startIndex, endIndex + _string.variableEnd.length);
            result.push(variable);
            endIndex += 2;
          }
        }
      }
    }
    return result;
  }
  function fireCustomTrigger(triggerFunction) {
    if (isDefinedFunction(triggerFunction)) {
      triggerFunction.apply(null, [].slice.call(arguments, 1));
    }
  }
  function createElement(container, type) {
    var nodeType = type.toLowerCase(), isText = nodeType === "text";
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
    for (var charIndex = 0; charIndex < 32; charIndex++) {
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
    return string.replace(new RegExp(find.replace(_string.variableDefault, "[" + _string.variableDefault + "]"), "g"), replace);
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
  function getDefaultFunction(value, defaultValue) {
    return isDefinedFunction(value) ? value : defaultValue;
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
    var parsed = true, result = null;
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
  _public.renderAll = function() {
    render();
    return _public;
  };
  _public.json = function() {
    var properties = getDefaultJsonProperties();
    return {includeAttributes:function(flag) {
      properties.includeAttributes = getDefaultBoolean(flag, properties.includeAttributes);
      return this;
    }, includeCssProperties:function(flag) {
      properties.includeCssProperties = getDefaultBoolean(flag, properties.includeCssProperties);
      return this;
    }, includeText:function(flag) {
      properties.includeText = getDefaultBoolean(flag, properties.includeText);
      return this;
    }, includeChildren:function(flag) {
      properties.includeChildren = getDefaultBoolean(flag, properties.includeChildren);
      return this;
    }, friendlyFormat:function(flag) {
      properties.friendlyFormat = getDefaultBoolean(flag, properties.friendlyFormat);
      return this;
    }, indentSpaces:function(spaces) {
      properties.indentSpaces = getDefaultNumber(spaces, properties.indentSpaces);
      return this;
    }, ignoreNodeTypes:function(types) {
      properties.ignoreNodeTypes = getDefaultStringOrArray(types, properties.ignoreNodeTypes);
      return this;
    }, ignoreCssProperties:function(cssProperties) {
      properties.ignoreCssProperties = getDefaultStringOrArray(cssProperties, properties.ignoreCssProperties);
      return this;
    }, ignoreAttributes:function(attributes) {
      properties.ignoreAttributes = getDefaultStringOrArray(attributes, properties.ignoreAttributes);
      return this;
    }, generateUniqueMissingIds:function(flag) {
      properties.generateUniqueMissingIds = getDefaultBoolean(flag, properties.generateUniqueMissingIds);
      return this;
    }, get:function(element) {
      return getJSON(element, properties);
    }, getVariables:function(json) {
      return getTemplateVariables(json);
    }};
  };
  _public.html = function() {
    var properties = getDefaultHtmlProperties();
    return {json:function(json) {
      properties.json = getDefaultString(json, properties.json);
      return this;
    }, templateData:function(templateData) {
      properties.templateData = getDefaultObject(templateData, properties.templateData);
      return this;
    }, removeOriginalAttributes:function(flag) {
      properties.removeOriginalAttributes = getDefaultBoolean(flag, properties.removeOriginalAttributes);
      return this;
    }, clearOriginalHTML:function(flag) {
      properties.clearOriginalHTML = getDefaultBoolean(flag, properties.clearOriginalHTML);
      return this;
    }, addCssToHead:function(flag) {
      properties.addCssToHead = getDefaultBoolean(flag, properties.addCssToHead);
      return this;
    }, clearCssFromHead:function(flag) {
      properties.clearCssFromHead = getDefaultBoolean(flag, properties.clearCssFromHead);
      return this;
    }, logTemplateDataWarnings:function(flag) {
      properties.logTemplateDataWarnings = getDefaultBoolean(flag, properties.logTemplateDataWarnings);
      return this;
    }, addAttributes:function(flag) {
      properties.addAttributes = getDefaultBoolean(flag, properties.addAttributes);
      return this;
    }, addCssProperties:function(flag) {
      properties.addCssProperties = getDefaultBoolean(flag, properties.addCssProperties);
      return this;
    }, addText:function(flag) {
      properties.addText = getDefaultBoolean(flag, properties.addText);
      return this;
    }, addChildren:function(flag) {
      properties.addChildren = getDefaultBoolean(flag, properties.addChildren);
      return this;
    }, write:function(element) {
      return writeHtml(element, properties);
    }, getVariables:function(element) {
      var result = [];
      if (isDefinedObject(element)) {
        result = getTemplateVariables(element.innerHTML);
      }
      return result;
    }};
  };
  _public.setConfiguration = function(newConfiguration) {
    var configurationChanges = false;
    if (isDefinedObject(newConfiguration)) {
      for (var propertyName in newConfiguration) {
        if (newConfiguration.hasOwnProperty(propertyName) && _configuration.hasOwnProperty(propertyName) && newConfiguration[propertyName] !== _configuration[propertyName]) {
          _configuration[propertyName] = newConfiguration[propertyName];
          configurationChanges = true;
        }
      }
      if (configurationChanges) {
        buildDefaultConfiguration(_configuration);
      }
    }
    return _public;
  };
  function buildDefaultConfiguration(newConfiguration) {
    _configuration = !isDefinedObject(newConfiguration) ? {} : newConfiguration;
    _configuration.safeMode = getDefaultBoolean(_configuration.safeMode, true);
    _configuration.domElementTypes = getDefaultStringOrArray(_configuration.domElementTypes, ["*"]);
    _configuration.formattingNodeTypes = getDefaultStringOrArray(_configuration.formattingNodeTypes, ["b", "strong", "i", "em", "mark", "small", "del", "ins", "sub", "sup"]);
    buildDefaultConfigurationStrings();
  }
  function buildDefaultConfigurationStrings() {
    _configuration.variableWarningText = getDefaultString(_configuration.variableWarningText, "Template variable {{variable_name}} not found.");
    _configuration.objectErrorText = getDefaultString(_configuration.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}");
    _configuration.attributeNotValidErrorText = getDefaultString(_configuration.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object.");
    _configuration.attributeNotSetErrorText = getDefaultString(_configuration.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly.");
  }
  _public.getVersion = function() {
    return "2.0.0";
  };
  (function(documentObject, windowObject, jsonObject, mathObject) {
    _parameter_Document = documentObject;
    _parameter_Window = windowObject;
    _parameter_JSON = jsonObject;
    _parameter_Math = mathObject;
    buildDefaultConfiguration();
    _parameter_Document.addEventListener("DOMContentLoaded", function() {
      render();
    });
    if (!isDefined(_parameter_Window.$jhson)) {
      _parameter_Window.$jhson = _public;
    }
  })(document, window, JSON, Math);
})();