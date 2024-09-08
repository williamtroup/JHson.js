# JHson.js - Public Functions:

Below is a list of all the public functions that can be called from the JHson.js instance.
<br>
<br>


## Binding:

### **renderAll()**:
Finds all the elements with the correct binding attribute and renders the JSON as HTML.
<br>
***Returns***: '*Object*' - The JHson.js class instance.
<br>
<br>


## JSON:

### **json()**:
Returns all the chained functions that will allow an HTML DOM element to be converted to JSON.
<br>
***Returns***: '*Object*' - The JSON properties object.
<br>

#### **json() > includeAttributes( *flag* )**:
States if the attributes should be included.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to true).
<br>
***Returns***: '*Object*' - The JSON properties object.
<br>

#### **json() > includeDataAttributes( *flag* )**:
States if the data attributes should be included.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to true).
<br>
***Returns***: '*Object*' - The JSON properties object.
<br>

#### **json() > includeCssProperties( *flag* )**:
States if the CSS style properties should be included.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to false).
<br>
***Returns***: '*Object*' - The JSON properties object.
<br>

#### **json() > includeText( *flag* )**:
States if the node text should be included.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to true).
<br>
***Returns***: '*Object*' - The JSON properties object.
<br>

#### **json() > includeChildren( *flag* )**:
States if the children should be included.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to true).
<br>
***Returns***: '*Object*' - The JSON properties object.
<br>

#### **json() > friendlyFormat( *flag* )**:
States if the JSON should be formatted in an easy-to-read layout.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to true).
<br>
***Returns***: '*Object*' - The JSON properties object.
<br>

#### **json() > indentSpaces( *spaces* )**:
States the total indent spaces that should be used for the friendly format JSON.
<br>
***Parameter: spaces***: '*number*' - The spaces value that should be used (defaults to 2).
<br>
***Returns***: '*Object*' - The JSON properties object.
<br>

#### **json() > ignoreNodeTypes( *types* )**:
States the node types that should not be included in the JSON.
<br>
***Parameter: types***: '*Object*' - The node types to ignore (can be an array of strings, or a space-separated string, and defaults to []).
<br>
***Returns***: '*Object*' - The JSON properties object.
<br>

#### **json() > ignoreCssProperties( *cssProperties* )**:
States the CSS properties that should not be included in the JSON.
<br>
***Parameter: cssProperties***: '*Object*' - The CSS properties to ignore (can be an array of strings, or a space-separated string, and defaults to []).
<br>
***Returns***: '*Object*' - The JSON properties object.
<br>

#### **json() > ignoreAttributes( *attributes* )**:
States the attributes that should not be included in the JSON.
<br>
***Parameter: attributes***: '*Object*' - The attributes to ignore (can be an array of strings, or a space-separated string, and defaults to []).
<br>
***Returns***: '*Object*' - The JSON properties object.
<br>

#### **json() > generateUniqueMissingIds( *flag* )**:
States if the JSON should include unique IDs for DOM elements that don't have them set already.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to false).
<br>
***Returns***: '*Object*' - The JSON properties object.
<br>

#### **json() > generateUniqueMissingIds( *flag* )**:
States if the JSON should include unique IDs for DOM elements that don't have them set already.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to false).
<br>
***Returns***: '*Object*' - The JSON properties object.
<br>

#### **json() > get( *element* )**:
Uses all the options selected via the chained functions to get the JSON from the HTML DOM element.
<br>
***Parameter: element***: '*Object*' - The DOM element to get the JSON for.
<br>
***Returns***: '*string*' - The JSON string.
<br>

#### **json() > getVariables( *json* )**:
Uses all the options selected via the chained functions to get the template variables from a JSON string.
<br>
***Parameter: json***: '*string*' - The JSON to get the template variables from.
<br>
***Returns***: '*string[]*' - The template variables.
<br>
<br>


## HTML:

### **html()**:
Returns all the chained functions that will allow JSON to be written as HTML DOM elements.
<br>
***Returns***: '*Object*' - The HTML properties object.
<br>

#### **html() > json( *json* )**:
States the JSON that should be written as HTML DOM elements.
<br>
***Parameter: json***: '*string*' - The JSON that should be converted to HTML.
<br>
***Returns***: '*Object*' - The HTML properties object.
<br>

#### **html() > templateData( *templateData* )**:
States the template data that should be used inside each HTML DOM elements HTML.
<br>
***Parameter: templateData***: '*Object*' - The template data to set inside each node's HTML.
<br>
***Returns***: '*Object*' - The HTML properties object.
<br>

#### **html() > removeOriginalAttributes( *flag* )**:
States if the original attributes on the element should be removed.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to true).
<br>
***Returns***: '*Object*' - The HTML properties object.
<br>

#### **html() > clearOriginalHTML( *flag* )**:
States if the original HTML in the element should be cleared.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to true).
<br>
***Returns***: '*Object*' - The HTML properties object.
<br>

#### **html() > addCssToHead( *flag* )**:
States if the CSS style properties should be written to a "style" tag in the HTML documents HEAD DOM element.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to false).
<br>
***Returns***: '*Object*' - The HTML properties object.
<br>

#### **html() > clearCssFromHead( *flag* )**:
States if all the CSS style tags should be cleared from the HTML documents HEAD DOM element.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to false).
<br>
***Returns***: '*Object*' - The HTML properties object.
<br>

#### **html() > logTemplateDataWarnings( *flag* )**:
States if the template data variables not found in any data are logged as warnings.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to false).
<br>
***Returns***: '*Object*' - The HTML properties object.
<br>

#### **html() > addAttributes( *flag* )**:
States if the attributes should be written for each element.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to true).
<br>
***Returns***: '*Object*' - The HTML properties object.
<br>

#### **html() > addCssProperties( *flag* )**:
States if the CSS properties should be written for each element.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to true).
<br>
***Returns***: '*Object*' - The HTML properties object.
<br>

#### **html() > addText( *flag* )**:
States if the text should be written for each element.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to true).
<br>
***Returns***: '*Object*' - The HTML properties object.
<br>

#### **html() > addChildren( *flag* )**:
States if the children should be written for each element.
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to true).
<br>
***Returns***: '*Object*' - The HTML properties object.
<br>

#### **html() > insertBefore( *flag* )**:
States if the elements should be added before the first detected child (if clearing the HTML is turned off).
<br>
***Parameter: flag***: '*boolean*' - The boolean flag that states the condition (defaults to true).
<br>
***Returns***: '*Object*' - The HTML properties object.
<br>

#### **html() > write( *element* )**:
Uses all the options selected via the chained functions to convert the JSON into HTML DOM elements.
<br>
***Parameter: element***: '*Object*' - The DOM element to add the new JSON HTML nodes to.
<br>
***Returns***: '*Object*' - The JHson.js class instance.
<br>

#### **html() > getVariables( *element* )**:
Uses all the options selected via the chained functions to get the template variables from a HTML DOM element.
<br>
***Parameter: element***: '*Object*' - The DOM element to get the template variables from.
<br>
***Returns***: '*string[]*' - The template variables.
<br>
<br>


## Configuration:

### **setConfiguration( *newConfiguration* )**:
Sets the specific configuration options that should be used.
<br>
***Parameter: newConfiguration***: '*Object*' - All the configuration options that should be set (refer to ["Configuration Options"](configuration/OPTIONS.md) documentation for properties).
<br>
***Returns***: '*Object*' - The JHson.js class instance.
<br>
<br>


## Additional Data:

### **getVersion()**:
Returns the version of JHson.js.
<br>
***Returns***: '*string*' - The version number.
<br>
<br>


## Example:

```markdown
<script> 
    var version = $jhson.getVersion();
</script>
```