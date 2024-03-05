# JHson.js - Configuration - Options:

Below are all the configuration options that can be passed to the "setConfiguration()" public function.
<br>
<br>


### Options:

| Type: | Name: | Description: |
| --- | --- | --- |
| *boolean* | safeMode | States if safe-mode is enabled (errors will be ignored and logged only, defaults to true). |
| *Object* | formattingNodeTypes | The text formatting nodes to check for (can be an array of strings, or a space separated string, and defaults to "b strong i em mark small del ins sub sup"). |

<br/>


### Options - Strings:

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | variableWarningText | The warning text that should be shown in the console when a template variable is not used (defaults to "Template variable {{variable_name}} not found."). |

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