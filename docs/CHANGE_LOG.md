# JHson.js - Change Log:

## Version 0.5.0:
- 

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