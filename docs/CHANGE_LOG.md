# JHson.js - Change Log:

## Version 0.7.0:
- 

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