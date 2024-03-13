# JHson.js - Configuration - Options:

Below are all the configuration options that can be passed to the "setConfiguration()" public function.
<br>
<br>


### Options:

| Type: | Name: | Description: |
| --- | --- | --- |
| *boolean* | safeMode | States if safe-mode is enabled (errors will be ignored and logged only, defaults to true). |
| *Object* | formattingNodeTypes | The text formatting nodes to check for (can be an array of strings, or a space-separated string, and defaults to "b strong i em mark small del ins sub sup"). |
| *Object* | domElementTypes | The DOM element types to lookup (can be either an array of strings, or a space separated string, and defaults to "*"). |

<br/>


### Options - Strings:

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | variableWarningText | The warning text that should be shown in the console when a template variable is not used (defaults to "Template variable {{variable_name}} not found."). |
| *string* | objectErrorText | The error text that should be shown when an object error is detected (defaults to "Errors in object: {{error_1}}, {{error_2}}"). |
| *string* | attributeNotValidErrorText | The error text that should be shown when a binding object is'nt valid (defaults to "The attribute '{{attribute_name}}' is not a valid object."). |
| *string* | attributeNotSetErrorText | The error text that should be shown when a binding attribute is'nt set (defaults to "The attribute '{{attribute_name}}' has not been set correctly."). |

<br/>


## Example:
<br/>

```markdown
<script> 
  $jhson.setConfiguration( {
      safeMode: false
  } );
</script>
```