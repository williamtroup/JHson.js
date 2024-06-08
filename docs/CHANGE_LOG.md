# JHson.js - Change Log:

## Version 1.2.0:
- BREAKING: Renamed the binding attribute "data-jhson-options" to "data-jhson-js".
- The public function "setConfiguration()" can now only be called with a valid object.
- Template variables now support defaults! This allows you to use the following syntax {{your_variable | your default value}} to specify a default value.
- The public function "html().write()" will now only do all of its actions of the json specified is valid.

<br>


## Version 1.1.0:
- Added "use strict" support internally and updated all public functions to use the new scope.
- Fixed a fault that caused the function parameter "properties" to collide with an outer scope variable of the same name for "json() > ignoreCssProperties()".

<br>


## Version 1.0.0:

#### **New Features:**
- Added binding support! You can now add the attribute "data-jhson-options" to any DOM element to bind JSON, which will be written as HTML.

#### **Binding Options:**
- Added binding options support, which is based on all the options available to "html()".

#### **Binding Options - Custom Triggers:**
- Added binding option custom trigger "onBeforeRenderComplete", which fires before the rendering of an element.
- Added binding option custom trigger "onRenderComplete", which fires when the rendering of an element is complete.

#### **Public Functions:**
- Added a new public function called "renderAll()", which will find all the DOM elements with the attribute assigned and render their JSON as HTML.

#### **Fixes & Improvements:**
- Fixed a major fault that caused the scope of the chained functions to fail when specific methods were called.
- Updated the main project description.

<br>


## Version 0.9.0:

#### **Public Functions:**
- Added "generateUniqueMissingIds()" support for "json()", which states if the JSON should contain unique IDs for elements that don't contain them.

#### **Fixes & Improvements:**
- Fixed a fault that allowed the text to be obtained for a textarea DOM element when the option "includeText()" is set to false.
- Improved the support for returning the correct scope when calling chained functions.

<br>


## Version 0.8.0:

#### **Public Functions:**
- Added "getVariables()" support for "html()", which is used to get all the template variables from an HTML DOM element.
- Added "getVariables()" support for "json()", which is used to get all the template variables from a JSON string.

<br>


## Version 0.7.0:

#### **Public Functions:**
- BREAKING: Renamed "html() > removeAttributes()" to "html() > removeOriginalAttributes()".
- BREAKING: Renamed "html() > clearHTML()" to "html() > clearOriginalHTML()".
- Added "addAttributes()" support for "html()", which states if the attributes should be written for each element when "write()" is called.
- Added "addCssProperties()" support for "html()", which states if the CSS properties should be written for each element when "write()" is called.
- Added "addText()" support for "html()", which states if the text should be written for each element when "write()" is called.
- Added "addChildren()" support for "html()", which states if the children should be written for each element when "write()" is called.

#### **Fixes & Improvements:**
- Internal refactoring to make areas a bit easier to read.

<br>


## Version 0.6.0:

#### **Public Functions:**
- Added "logTemplateDataWarnings()" support for "html()", which states if the template variables are not found should be logged as warnings when "write()" is called.

#### **Configuration Options:**
- Added new configuration option "variableWarningText", which states the warning text that should be shown in the console when a template variable is not used (defaults to "Template variable {{variable_name}} not found.").
- Added new configuration option "objectErrorText", which states the error text that should be shown when an object error is detected (defaults to "Errors in object: {{error_1}}, {{error_2}}").

#### **Fixes & Improvements:**
- Fixed "clearCssFromHead()" throwing an error when clearing the style tags from the DOM documents head.
- Updated README.md and README_NUGET.md to include the latest chained function calls.
- Minor internal renames to make way for future enhancements.

<br>


## Version 0.5.0:

#### **Public Functions:**
- BREAKING: Renamed "json() > includeCssStyles()" to "json() > includeCssProperties()".
- When "addCssToHead()" is used for "html()", all the CSS is now placed in one "style" node in the HTML document head, instead of multiple ones!
- When "addCssToHead()" is used for "html()", the CSS will now use the CSS class from the DOM element (it reverts to the DOM element ID if not available).
- Added "ignoreNodeTypes()" support for "json()", which states the node types that should not be included in the JSON returned from "get()".
- Added "ignoreCssProperties()" support for "json()", which states the CSS properties that should not be included in the JSON returned from "get()".
- Added "ignoreAttributes()" support for "json()", which states the attributes that should not be included in the JSON returned from "get()".

#### **Configuration Options:**
- Removed the configuration option "nodeTypesToIgnore" (no longer needed).
- Removed the configuration option "cssPropertiesToIgnore" (no longer needed).

#### **Fixes & Improvements:**
- Fixed a minor formatting issue in the "package.json" file.
- Fixed a fault that caused the text to be ignored for some elements.
- Fixed HTML testing files not referencing some of the recent changes.
- Fixed issues with lowercase usage being done multiple times.
- Updated README.md and README_NUGET.md to include the latest chained function calls.
- Updated README.md and README_NUGET.md to include the new features added recently.

<br>


## Version 0.4.0:

#### **New Features:**
- CSS styles can now be written to the head of the HTML document instead of each DOM element!

#### **Public Functions:**
- Added "addCssToHead()" support for "html()", which will force all CSS style properties to be added as "style" tags to the head of the HTML document.
- Added "indentSpaces()" support for "json()", which states the total number of indent spaces to use for the friendly format JSON returned from "get()".
- Added "clearCssFromHead()" support for "html()", which will force all CSS style tags to be removed from the head of the HTML document.

#### **Configuration Options:**
- Removed the configuration option "jsonIndentationSpaces" (no longer needed).

<br>


## Version 0.3.0:

#### **Public Functions:**
- All boolean-based chained functions (such as "json()" > "includeAttributes()") now support flags (with proper defaults).
- Restored all original defaults for the new chained functions.
- Object types now have to be valid for all public functions.

#### **Fixes & Improvements:**
- Improved the HTML testing files.
- Fixed README.md and README_NUGET.md errors.

<br>


## Version 0.2.0:

#### **New Features:**
- Added function chaining support when getting and writing (see detailed changes).

#### **Public Functions:**
- BREAKING: "get()" has been renamed to "json()" and now supports function-chaining, which allows greater control over the options used when generating the JSON.
- BREAKING: "write()" has been renamed to "html()" and now supports function-chaining, which allows greater control over the options used when converting JSON to HTML.
- "html()" now supports: "removeAttributes()" and "clearHTML()".
- "json()" now supports: "includeChildren()".

#### **Configuration Options:**
- Added new configuration option "formattingNodeTypes", which states the text formatting nodes to check for (defaults to "b strong i em mark small del ins sub sup").

#### **Fixes & Improvements:**
- Fixed a fault that caused all pre-configured configuration options to be wiped out when calling "setConfiguration()".
- Improved the HTML testing files.

<br>


## Version 0.1.0:
- Everything :)