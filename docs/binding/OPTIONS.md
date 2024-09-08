# JHson.js - Binding Options:

Below are all the JSON properties that can be passed in the "data-jhson-js" binding attribute for a DOM element.


## Standard Options:

| Type: | Name: | Description: |
| --- | --- | --- |
| *string* | json | States the JSON that should be written as HTML DOM elements (defaults to null). |
| *object* | templateData | States the template data that should be used inside each HTML DOM elements HTML (defaults to {}). |
| *boolean* | removeOriginalAttributes | States if the original attributes on the element should be removed (defaults to true). |
| *boolean* | removeOriginalDataAttributes | States if the original data attributes on the element should be removed (defaults to true). |
| *boolean* | clearOriginalHTML | States if the original HTML in the element should be cleared (defaults to true). |
| *boolean* | addCssToHead | States if the CSS style properties should be written to a "style" tag in the HTML documents HEAD DOM element (defaults to false). |
| *boolean* | clearCssFromHead | States if all the CSS style tags should be cleared from the HTML documents HEAD DOM element (defaults to false). |
| *boolean* | logTemplateDataWarnings | States if the template data variables not found in any data are logged as warnings (defaults to false). |
| *boolean* | addAttributes | States if the attributes should be written for each element (defaults to true). |
| *boolean* | addDataAttributes | States if the data attributes should be written for each element (defaults to true). |
| *boolean* | addCssProperties | States if the CSS properties should be written for each element (defaults to true). |
| *boolean* | addText | States if the text should be written for each element (defaults to true). |
| *boolean* | addChildren | States if the children should be written for each element (defaults to true). |
| *boolean* | insertBefore | States if the elements should be added before the first detected child (if clearing the HTML is turned off, defaults to false). |

<br/>


## Binding Example:

```markdown
<div data-jhson-js="{ 'json': 'json string' }">
    Your HTML.
</div>
```