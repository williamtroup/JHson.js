# JHson.js - Configuration - Options:

Below are all the configuration options that can be passed to the "setConfiguration()" public function.


| Type: | Name: | Description: |
| --- | --- | --- |
| *Object* | nodeTypesToIgnore | The DOM node types to ignore (can be either an array of strings, or a space separated string, and defaults to "*"). |

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