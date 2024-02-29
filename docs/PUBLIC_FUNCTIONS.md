# JHson.js - Functions:

Below is a list of all the public functions that can be called from the JHson.js instance.
<br>
<br>


## JSON:

### **get( *element*, *includeAttributes*, *includeCssStyles*, *includeText*, *friendlyFormat* )**:
Gets the JSON from a DOM element.
<br>
***Parameter: element***: '*Object*' - The DOM element to get the JSON for.
<br>
***Parameter: includeAttributes***: '*boolean*' - Should the Attributes be included in the JSON (defaults to true).
<br>
***Parameter: includeCssStyles***: '*boolean*' - Should the CSS Styles be included in the JSON (defaults to false).
<br>
***Parameter: includeText***: '*boolean*' - Should the Text be included in the JSON (defaults to true).
<br>
***Parameter: friendlyFormat***: '*boolean*' - Should the JSON be returned in an easy-to-read format (defaults to true).
<br>
***Returns***: '*string*' - The HTML JSON.
<br>

### **write( *element*, *json*, *templateData* )**:
Converts JSON to HTML and adds it to a parent node.
<br>
***Parameter: element***: '*Object*' - The DOM element to add the new JSON HTML nodes to.
<br>
***Parameter: json***: '*string*' - The JSON that should be converted to HTML.
<br>
***Parameter: templateData***: '*Object*' - The template data to set (defaults to null).
<br>
***Returns***: '*Object*' - The JHson.js class instance.
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
Returns the version of v.js.
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