# JHson.js v2.3.0

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=JHson.js%2C%20a%20free%20JavaScript%json%20converter&url=https://github.com/williamtroup/JHson.js&hashtags=javascript,json,html,converter)
[![npm](https://img.shields.io/badge/npmjs-v2.3.0-blue)](https://www.npmjs.com/package/jhson.js)
[![nuget](https://img.shields.io/badge/nuget-v2.3.0-purple)](https://www.nuget.org/packages/JHson.js/)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/williamtroup/JHson.js/blob/main/LICENSE.txt)
[![discussions Welcome](https://img.shields.io/badge/discussions-Welcome-red)](https://github.com/williamtroup/JHson.js/discussions)
[![coded by William Troup](https://img.shields.io/badge/coded_by-William_Troup-yellow)](https://william-troup.com/)

> 📃 A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.


## What features does JHson.js have?

- 😏 Zero-dependencies and extremely lightweight!
- 🦾 Written in TypeScript, allowing greater support for React, Angular, and other libraries!
- 💻 Full API available via public functions.
- 🌈 Full support for Attributes, CSS style properties, and formatted text!
- ⭐ Write your JSON directly to any DOM element for rendering, or get the base element for use elsewhere.
- 📋 Copy the layout for an entire page without additional files!
- 🔍 Apply additional filters to exclude specific node types, CSS styles, attributes, etc.
- 🔠 Data templating for text (with defaults support).
- 🎥 Write CSS directly back to the head for each element!
- 💧 Bind JSON directly to DOM elements!
- 📷 Include and write images as Base 64 URLs.


## What browsers are supported?

All modern browsers (such as Google Chrome, FireFox, and Opera) are fully supported.


## What are the most recent changes?

To see a list of all the most recent changes, click [here](https://www.william-troup.com/jhson-js/documentation/recent-changes.html).


## How do I install JHson.js?

You can install the library with npm into your local modules directory using the following command:

```markdown
npm install jhson.js
```

Or, you can download the latest zipped up version [here](https://www.william-troup.com/jhson-js/download.html).

Or, you can also use the following CDN links:

```markdown
https://cdn.jsdelivr.net/gh/williamtroup/JHson.js@2.3.0/dist/jhson.min.js
https://cdn.jsdelivr.net/gh/williamtroup/JHson.js@2.3.0/dist/jhson.export.js
```


## How do I get started?

To get started using JHson.js, do the following steps:

### 1. Prerequisites:

Make sure you include the "DOCTYPE html" tag at the top of your HTML, as follows:

```markdown
<!DOCTYPE html>
```

### 2. Include Files:

```markdown
<script src="dist/jhson.js"></script>
```

### 3. DOM Element Binding:

```markdown
<div id="header" class="header">
    <h1>JHson.js</h1>
    <p>This is a {{template_type | basic}} example of how to use <b>JHson.js</b> ... with template data {{template_data}}.</p>
</div>

<script>
    var header = document.getElementById( "header" );

    var json = $jhson
        .json()
        .includeAttributes( true )
        .includeDataAttributes( true )
        .includeCssProperties( true )
        .includeText( true )
        .includeChildren( true )
        .includeImagesAsBase64( false )
        .friendlyFormat( true )
        .indentSpaces( 2 )
        .ignoreNodeTypes( "q" )
        .ignoreNodeCondition( null )
        .ignoreCssProperties( "padding" )
        .ignoreAttributes( "data-your-attribute" )
        .generateUniqueMissingIds( false )
        .generateUniqueMissingNames( false )
        .propertyReplacer( null )
        .get( header );

    $jhson
        .html()
        .json( json )
        .templateData( { "{{template_data}}": "this template data" } )
        .removeOriginalAttributes( true )
        .removeOriginalDataAttributes( true )
        .clearOriginalHTML( true )
        .addCssToHead( false )
        .clearCssFromHead( false )
        .logTemplateDataWarnings( false )
        .addAttributes( true )
        .addDataAttributes( true )
        .addCssProperties( true )
        .addText( true )
        .addChildren( true )
        .insertBefore( false )
        .write( header );

    var element = $jhson
        .html()
        .json( json )
        .templateData( { "{{template_data}}": "this template data" } )
        .removeOriginalAttributes( true )
        .removeOriginalDataAttributes( true )
        .clearOriginalHTML( true )
        .addCssToHead( false )
        .clearCssFromHead( false )
        .logTemplateDataWarnings( false )
        .addAttributes( true )
        .addDataAttributes( true )
        .addCssProperties( true )
        .addText( true )
        .addChildren( true )
        .get();
</script>
```


### 4. DOM Element Binding (for writing JSON as HTML):

```markdown
<div data-jhson-js="{ 'json': 'json string' }">
    Your HTML.
</div>
```

To see a list of all the available binding options you can use for "data-jhson-js", click [here](https://www.william-troup.com/jhson-js/documentation/binding-options.html).

To see a list of all the available custom triggers you can use for "data-jhson-js", click [here](https://www.william-troup.com/jhson-js/documentation/binding-options-custom-triggers.html).


### 5. Finishing Up:

That's it! Nice and simple. Please refer to the code if you need more help (fully documented).


## How do I go about customizing JHson.js?

To customize, and get more out of JHson.js, please read through the following documentation.


### 1. Public Functions:

To see a list of all the public functions available, click [here](https://www.william-troup.com/jhson-js/documentation/public-functions.html).


### 2. Configuration:

Configuration options allow you to customize how JHson.js will function.  You can set them as follows:

```markdown
<script> 
    $jhson.setConfiguration( {
        safeMode: false
    } );
</script>
```

To see a list of all the available configuration options you can use, click [here](https://www.william-troup.com/jhson-js/documentation/options.html).