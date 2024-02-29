# JHson.js - Configuration - Options:

Below are all the configuration options that can be passed to the "setConfiguration()" public function.


| Type: | Name: | Description: |
| --- | --- | --- |
| *boolean* | safeMode | States if safe-mode is enabled (errors will be ignored and logged only, defaults to true). |
| *Object* | nodeTypesToIgnore | The DOM node types to ignore (can be an array of strings, or a space separated string, and defaults to []). |
| *Object* | cssPropertiesToIgnore | The CSS properties to ignore (can be an array of strings, or a space separated string, and defaults to []). |
| *number* | jsonIndentationSpaces | States the total indentation spaces that should be used for easy-to-read JSON (defaults to 2). |
| *Object* | formattingNodeTypes | The text formatting nodes to check for (can be an array of strings, or a space separated string, and defaults to "b strong i em mark small del ins sub sup"). |

<br/>


## Example:
<br/>

```markdown
<script> 
  $jhson.setConfiguration( {
      nodeTypesToIgnore: [ "script" ]
  } );
</script>
```