<h1 align="center">
JHson.js

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=JHson.js%2C%20a%20free%20JavaScript%json%20converter&url=https://github.com/williamtroup/JHson.js&hashtags=javascript,json,html,converter)
[![npm](https://img.shields.io/badge/npmjs-v0.5.0-blue)](https://www.npmjs.com/package/jhson.js)
[![nuget](https://img.shields.io/badge/nuget-v0.5.0-purple)](https://www.nuget.org/packages/JHson.js/)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/williamtroup/JHson.js/blob/main/LICENSE.txt)
[![discussions Welcome](https://img.shields.io/badge/discussions-Welcome-red)](https://github.com/williamtroup/JHson.js/discussions)
[![coded by William Troup](https://img.shields.io/badge/coded_by-William_Troup-yellow)](https://william-troup.com/)
</h1>

> <p align="center">📃 A JavaScript library for converting HTML to JSON, and JSON to HTML, with templating, attributes, and CSS support.</p>
> <p align="center">v0.5.0</p>
<br />
<br />


<h1>What features does JHson.js have?</h1>

- Zero-dependencies and extremely lightweight!
- Full API available via public functions.
- Full support for Attributes, CSS style properties, and formatted text!
- Write your JSON directly to any DOM element for rendering.
- Copy the layout for an entire page without additional files!
- Data templating for text.
- Write CSS directly back to the head for each element!
<br />
<br />


<h1>What browsers are supported?</h1>

All modern browsers (such as Google Chrome, FireFox, and Opera) are fully supported.
<br>
<br>


<h1>What are the most recent changes?</h1>

To see a list of all the most recent changes, click [here](docs/CHANGE_LOG.md).
<br>
<br>


<h1>How do I install JHson.js?</h1>

You can install the library with npm into your local modules directory using the following command:

```markdown
npm install jhson.js
```
<br>
<br>


<h1>How do I get started?</h1>

To get started using JHson.js, do the following steps:
<br>
<br>

### 1. Prerequisites:

Make sure you include the "DOCTYPE html" tag at the top of your HTML, as follows:

```markdown
<!DOCTYPE html>
```
<br>


### 2. Include Files:

```markdown
<script src="dist/jhson.js"></script>
```
<br>


### 3. Getting/Rendering JSON:

```markdown
<div id="header" class="header">
    <h1>JHson.js</h1>
    <p>This is a basic example of how to use <b>JHson.js</b> ... with template data {{template_data}}.</p>
</div>

<script>
    var header = document.getElementById( "header" );

    var json = $jhson.json()
        .includeAttributes( true )
        .includeCssProperties( true )
        .includeText( true )
        .includeChildren( true )
        .friendlyFormat( true )
        .indentSpaces( 2 )
        .ignoreNodeTypes( "q" )
        .ignoreCssProperties( "padding" )
        .get( header );

    $jhson
        .html()
        .json( json )
        .templateData( { "{{template_data}}": "this template data" } )
        .removeAttributes( true )
        .clearHTML( true )
        .addCssToHead( false )
        .clearCssFromHead( false )
        .write( header );
</script>
```

<br>


### 4. Finishing Up:

That's it! Nice and simple. Please refer to the code if you need more help (fully documented).
<br>
<br>

<h1>How do I go about customizing JHson.js?</h1>

To customize, and get more out of JHson.js, please read through the following documentation.
<br>
<br>


### 1. Public Functions:

To see a list of all the public functions available, click [here](docs/PUBLIC_FUNCTIONS.md).
<br>
<br>


### 2. Configuration:

Configuration options allow you to customize how JHson.js will function.  You can set them as follows:

```markdown
<script> 
  $jhson.setConfiguration( {
      nodeTypesToIgnore: [ "script" ]
  } );
</script>
```

To see a list of all the available configuration options you can use, click [here](docs/configuration/OPTIONS.md).