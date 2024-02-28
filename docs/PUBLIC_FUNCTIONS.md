# JHson.js - Functions:

Below is a list of all the public functions that can be called from the JHson.js instance.
<br>
<br>


## Configuration:

### **setConfiguration( *newOptions* )**:
Sets the specific configuration options that should be used.
<br>
***Parameter: newOptions***: '*Options*' - All the configuration options that should be set (refer to ["Configuration Options"](configuration/OPTIONS.md) documentation for properties).
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