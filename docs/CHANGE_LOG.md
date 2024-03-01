# JHson.js - Change Log:

## Version 0.3.0:

#### **Public Functions:**
- All boolean-based chained functions (such as "json()" > "includeAttributes()") now support flags (with proper defaults).

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