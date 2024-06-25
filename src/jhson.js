/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        jhson.js
 * @version     v1.2.2
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


( function() {
    "use strict";

    var // Variables: Constructor Parameters
        _parameter_Document = null,
        _parameter_Window = null,
        _parameter_JSON = null,
        _parameter_Math = null,

        // Variables: Public Scope
        _public = {},

        // Variables: Configuration
        _configuration = {},

        // Variables: Elements
        _elements_Type = {},

        // Variables: Strings
        _string = {
            empty: "",
            space: " ",
            newLine: "\n",
            variableStart: "{{",
            variableEnd: "}}",
            variableDefault: "|"
        },

        // Variables: JSON
        _json = {
            text: "#text",
            cssStyle: "$",
            attribute: "@",
            children: "&children",
        },

        // Variables: Values
        _value = {
            notFound: -1
        },

        // Variables: Attribute Names
        _attribute_Name_Options = "data-jhson-js";


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Rendering
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function render() {
        var tagTypes = _configuration.domElementTypes,
            tagTypesLength = tagTypes.length;

        for ( var tagTypeIndex = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++ ) {
            var domElements = _parameter_Document.getElementsByTagName( tagTypes[ tagTypeIndex ] ),
                elements = [].slice.call( domElements ),
                elementsLength = elements.length;

            for ( var elementIndex = 0; elementIndex < elementsLength; elementIndex++ ) {
                if ( !renderBindingElement( elements[ elementIndex ] ) ) {
                    break;
                }
            }
        }
    }

    function renderBindingElement( element ) {
        var result = true;

        if ( isDefined( element ) && element.hasAttribute( _attribute_Name_Options ) ) {
            var bindingOptionsData = element.getAttribute( _attribute_Name_Options );

            if ( isDefinedString( bindingOptionsData ) ) {
                var bindingOptions = getObjectFromString( bindingOptionsData );

                if ( bindingOptions.parsed && isDefinedObject( bindingOptions.result ) ) {
                    renderElement( renderBindingOptions( bindingOptions.result, element ) );

                } else {
                    if ( !_configuration.safeMode ) {
                        console.error( _configuration.attributeNotValidErrorText.replace( "{{attribute_name}}", _attribute_Name_Options ) );
                        result = false;
                    }
                }

            } else {
                if ( !_configuration.safeMode ) {
                    console.error( _configuration.attributeNotSetErrorText.replace( "{{attribute_name}}", _attribute_Name_Options ) );
                    result = false;
                }
            }
        }

        return result;
    }

    function renderBindingOptions( data, element ) {
        var bindingOptions = buildAttributeOptions( data );

        bindingOptions.currentView = {};
        bindingOptions.currentView.element = element;

        return bindingOptions;
    }

    function renderElement( bindingOptions ) {
        fireCustomTrigger( bindingOptions.onBeforeRender, bindingOptions.element );

        var properties = getDefaultHtmlProperties();
        properties.json = bindingOptions.json;

        writeHtml( bindingOptions.currentView.element, properties );

        fireCustomTrigger( bindingOptions.onRenderComplete, bindingOptions.element );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Binding Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function buildAttributeOptions( newOptions ) {
        var options = getDefaultObject( newOptions, {} ),
            optionPropertyDefaults = getDefaultHtmlProperties();

        options.json = getDefaultString( options.json, optionPropertyDefaults.json );
        options.templateData = getDefaultObject( options.templateData, optionPropertyDefaults.templateData );
        options.removeOriginalAttributes = getDefaultBoolean( options.removeOriginalAttributes, optionPropertyDefaults.removeOriginalAttributes );
        options.clearOriginalHTML = getDefaultBoolean( options.clearOriginalHTML, optionPropertyDefaults.clearOriginalHTML );
        options.addCssToHead = getDefaultBoolean( options.addCssToHead, optionPropertyDefaults.addCssToHead );
        options.clearCssFromHead = getDefaultBoolean( options.clearCssFromHead, optionPropertyDefaults.clearCssFromHead );
        options.logTemplateDataWarnings = getDefaultBoolean( options.logTemplateDataWarnings, optionPropertyDefaults.logTemplateDataWarnings );
        options.addAttributes = getDefaultBoolean( options.addAttributes, optionPropertyDefaults.addAttributes );
        options.addCssProperties = getDefaultBoolean( options.addCssProperties, optionPropertyDefaults.addCssProperties );
        options.addText = getDefaultBoolean( options.addText, optionPropertyDefaults.addText );
        options.addChildren = getDefaultBoolean( options.addChildren, optionPropertyDefaults.addChildren );

        options = buildAttributeOptionCustomTriggers( options );

        return options;
    }

    function buildAttributeOptionCustomTriggers( options ) {
        options.onBeforeRender = getDefaultFunction( options.onBeforeRender, null );
        options.onRenderComplete = getDefaultFunction( options.onRenderComplete, null );

        return options;
    }

    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * JSON - Get
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getDefaultJsonProperties() {
        return {
            includeAttributes: true,
            includeCssProperties: false,
            includeText: true,
            includeChildren: true,
            friendlyFormat: true,
            indentSpaces: 2,
            ignoreNodeTypes: [],
            ignoreCssProperties: [],
            ignoreAttributes: [],
            generateUniqueMissingIds: false
        };
    }

    function getJSON( element, properties ) {
        var result = _string.empty;

        if ( isDefinedObject( element ) ) {
            var resultJson = {},
                elementJson = getElementObject( element, properties, {} );

            resultJson[ elementJson.nodeName ] = elementJson.nodeValues;

            if ( properties.friendlyFormat ) {
                result = _parameter_JSON.stringify( resultJson, null, properties.indentSpaces );
            } else {
                result = _parameter_JSON.stringify( resultJson );
            }
        }
        
        return result;
    }

    function getElementObject( element, properties, parentCssStyles ) {
        var result = {},
            childrenLength = element.children.length,
            childrenAdded = 0;

        if ( properties.includeAttributes ) {
            getElementAttributes( element, result, properties );
        }

        if ( properties.includeCssProperties ) {
            getElementCssProperties( element, result, properties, parentCssStyles );
        }

        if ( properties.includeChildren && childrenLength > 0 ) {
            childrenAdded = getElementChildren( element, result, childrenLength, properties, parentCssStyles );
        }

        if ( properties.includeText ) {
            getElementText( element, result, childrenAdded );
        }

        if ( isDefined( result[ _json.children ] ) && result[ _json.children ].length === 0 ) {
            delete result[ _json.children ];
        }

        return {
            nodeName: element.nodeName.toLowerCase(),
            nodeValues: result
        };
    }

    function getElementAttributes( element, result, properties ) {
        var attributesLength = element.attributes.length,
            attributesAvailable = [];

        if ( properties.includeText && element.nodeName.toLowerCase() === "textarea" && isDefined( element.value ) ) {
            result[ _json.text ] = element.value;
        }

        for ( var attributeIndex = 0; attributeIndex < attributesLength; attributeIndex++ ) {
            var attribute = element.attributes[ attributeIndex ];

            if ( isDefinedString( attribute.nodeName ) && properties.ignoreAttributes.indexOf( attribute.nodeName ) === _value.notFound ) {
                result[ _json.attribute + attribute.nodeName ] = attribute.nodeValue;
                attributesAvailable.push( attribute.nodeName );
            }
        }

        if ( properties.generateUniqueMissingIds && attributesAvailable.indexOf( "id" ) === _value.notFound && properties.ignoreAttributes.indexOf( "id" ) === _value.notFound) {
            result[ _json.attribute + "id" ] = newGuid();
        }
    }

    function getElementCssProperties( element, result, properties, parentCssStyles ) {
        if ( _parameter_Window.getComputedStyle ) {
            var cssComputedStyles = _parameter_Document.defaultView.getComputedStyle( element ),
                cssComputedStylesLength = cssComputedStyles.length;

            for ( var cssComputedStyleIndex = 0; cssComputedStyleIndex < cssComputedStylesLength; cssComputedStyleIndex++ ) {
                var cssComputedStyleName = cssComputedStyles[ cssComputedStyleIndex ];

                if ( properties.ignoreCssProperties.indexOf( cssComputedStyleName ) === _value.notFound ) {
                    var cssComputedStyleNameStorage = _json.cssStyle + cssComputedStyleName,
                        cssComputedValue = cssComputedStyles.getPropertyValue( cssComputedStyleName );

                    if ( !parentCssStyles.hasOwnProperty( cssComputedStyleNameStorage ) || parentCssStyles[ cssComputedStyleNameStorage ] !== cssComputedValue ) {
                        result[ cssComputedStyleNameStorage ] = cssComputedValue;
                        parentCssStyles[ cssComputedStyleNameStorage ] = result[ cssComputedStyleNameStorage ];
                    }
                }
            }
        }
    }

    function getElementChildren( element, result, childrenLength, properties, parentCssStyles ) {
        var totalChildren = 0;
        
        result[ _json.children ] = [];

        for ( var childrenIndex = 0; childrenIndex < childrenLength; childrenIndex++ ) {
            var child = element.children[ childrenIndex ],
                childElementData = getElementObject( child, properties, getParentCssStylesCopy( parentCssStyles ) ),
                addChild = false;

            if ( _configuration.formattingNodeTypes.indexOf( childElementData.nodeName ) > _value.notFound ) {
                totalChildren++;
            } else {

                if ( properties.ignoreNodeTypes.indexOf( childElementData.nodeName ) === _value.notFound ) {
                    addChild = true;
                    totalChildren++;
                }
            }

            if ( addChild ) {
                var childJson = {};
                childJson[ childElementData.nodeName ] = childElementData.nodeValues;

                result[ _json.children ].push( childJson );
            }
        }

        return totalChildren;
    }

    function getElementText( element, result, childrenAdded ) {
        if ( isDefinedString( element.innerText ) ) {
            if ( childrenAdded > 0 && isDefined( result[ _json.children ] ) && result[ _json.children ].length === 0 ) {
                result[ _json.text ] = element.innerHTML;
            } else {
    
                if ( element.innerText.trim() === element.innerHTML.trim() ) {
                    result[ _json.text ] = element.innerText;
                }
            }
        }
    }

    function getParentCssStylesCopy( parentCssStyles ) {
        var copy = {};

        for ( var cssStyleName in parentCssStyles ) {
            if ( parentCssStyles.hasOwnProperty( cssStyleName ) ) {
                copy[ cssStyleName ] = parentCssStyles[ cssStyleName ];
            }
        }

        return copy;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * JSON - Write HTML
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getDefaultHtmlProperties() {
        return {
            json: _string.empty,
            templateData: {},
            removeOriginalAttributes: true,
            clearOriginalHTML: true,
            addCssToHead: false,
            clearCssFromHead: false,
            logTemplateDataWarnings: false,
            addAttributes: true,
            addCssProperties: true,
            addText: true,
            addChildren: true
        };
    }

    function writeHtml( element, properties ) {
        if ( isDefinedObject( element ) && isDefinedString( properties.json ) ) {
            var convertedJsonObject = getObjectFromString( properties.json ),
                writingScope = {
                css: {},
                templateDataKeys: [],
                templateDataKeysLength: 0,
                templateDataKeysProcessed: []
            };

            if ( convertedJsonObject.parsed && isDefinedObject( convertedJsonObject.result ) ) {
                if ( properties.clearCssFromHead ) {
                    clearCssStyleTagsFromHead();
                }
    
                if ( isDefinedObject( properties.templateData ) ) {
                    setupWritingScopeTemplateDataKeys( properties, writingScope );
                }

                for ( var key in convertedJsonObject.result ) {
                    if ( key === element.nodeName.toLowerCase() ) {
                        if ( properties.removeOriginalAttributes ) {
                            while ( element.attributes.length > 0 ) {
                                element.removeAttribute( element.attributes[ 0 ].name );
                            }
                        }

                        if ( properties.clearOriginalHTML ) {
                            element.innerHTML = _string.empty;
                        }

                        writeNode( element, convertedJsonObject.result[ key ], properties, writingScope );
                    }
                }

                processRemainingVariablesForDefaults( element );

                if ( properties.addCssToHead ) {
                    writeCssStyleTag( writingScope );
                }
    
                if ( properties.logTemplateDataWarnings ) {
                    checkedForUnusedTemplateData( writingScope );
                }
            }
        }

        return _public;
    }

    function setupWritingScopeTemplateDataKeys( properties, writingScope ) {
        for ( var templateDataKey in properties.templateData ) {
            if ( properties.templateData.hasOwnProperty( templateDataKey ) ) {
                writingScope.templateDataKeys.push( templateDataKey );
            }
        }

        writingScope.templateDataKeys = writingScope.templateDataKeys.sort( function( a, b ) {
            return b.length - a.length;
        } );

        writingScope.templateDataKeysLength = writingScope.templateDataKeys.length;
    }

    function writeNode( element, jsonObject, properties, writingScope ) {
        var cssStyles = [];

        for ( var jsonKey in jsonObject ) {
            if ( startsWithAnyCase( jsonKey, _json.attribute ) ) {
                if ( properties.addAttributes ) {
                    var attributeName = jsonKey.replace( _json.attribute, _string.empty ),
                        attributeValue = jsonObject[ jsonKey ];

                    element.setAttribute( attributeName, attributeValue );
                }

            } else if ( startsWithAnyCase( jsonKey, _json.cssStyle ) ) {
                if ( properties.addCssProperties ) {
                    var cssStyleName = jsonKey.replace( _json.cssStyle, _string.empty );

                    if ( !properties.addCssToHead ) {
                        element.style[ cssStyleName ] = jsonObject[ jsonKey ];
                    } else {
                        cssStyles.push( cssStyleName + ":" + jsonObject[ jsonKey ] + ";" );
                    }
                }

            } else if ( jsonKey === _json.text ) {
                if ( properties.addText ) {
                    writeElementTextAndTemplateData( element, jsonObject[ jsonKey ], properties, writingScope );
                }

            } else if ( jsonKey === _json.children ) {
                if ( properties.addChildren ) {
                    var childrenLength = jsonObject[ jsonKey ].length;

                    for ( var childrenIndex = 0; childrenIndex < childrenLength; childrenIndex++ ) {
                        var childJson = jsonObject[ jsonKey ][ childrenIndex ];
    
                        for ( var childJsonKey in childJson ) {
                            if ( childJson.hasOwnProperty( childJsonKey ) ) {
                                var childElement = createElement( element, childJsonKey.toLowerCase() );
    
                                writeNode( childElement, childJson[ childJsonKey ], properties, writingScope );
                            }
                        }
                    }
                }
            }
        }

        if ( cssStyles.length > 0 ) {
            storeCssStyles( element, cssStyles, writingScope );
        } 
    }

    function writeElementTextAndTemplateData( element, value, properties, writingScope ) {
        element.innerHTML = value;

        if ( writingScope.templateDataKeysLength > 0 ) {
            for ( var templateDataKeyIndex = 0; templateDataKeyIndex <  writingScope.templateDataKeysLength; templateDataKeyIndex++ ) {
                var templateDataKey = writingScope.templateDataKeys[ templateDataKeyIndex ];

                if ( properties.templateData.hasOwnProperty( templateDataKey ) ) {
                    var templateDataKeyReplacement = properties.templateData[ templateDataKey ];

                    if ( element.innerHTML.indexOf( templateDataKey ) > _value.notFound ) {
                        element.innerHTML = replaceAll( element.innerHTML, templateDataKey, templateDataKeyReplacement );

                        if ( writingScope.templateDataKeysProcessed.indexOf( templateDataKey ) === _value.notFound ) {
                            writingScope.templateDataKeysProcessed.push( templateDataKey );
                        }

                    } else {
                        templateDataKey = templateDataKey.replace( _string.variableEnd, _string.empty ) + _string.space + _string.variableDefault;

                        var startIndex = element.innerHTML.indexOf( templateDataKey );

                        if ( startIndex > _value.notFound ) {
                            var endIndex = element.innerHTML.indexOf( _string.variableEnd, startIndex );

                            if ( endIndex > _value.notFound ) {
                                
                                var variable = element.innerHTML.substring( startIndex, endIndex + _string.variableEnd.length );
                                
                                element.innerHTML = replaceAll( element.innerHTML, variable, templateDataKeyReplacement );
                            }
                        }
                    }
                }
            }
        }
    }

    function storeCssStyles( element, cssStyles, writingScope ) {
        var identifier = null;

        if ( isDefinedString( element.className ) ) {
            var classNameParts = element.className.split( _string.space );

            identifier = element.nodeName.toLowerCase() + "." + classNameParts[ 0 ] + " {";
        } else {

            if ( !isDefinedString( element.id ) ) {
                element.id = newGuid();
            }

            identifier = "#" + element.id + " {";
        }

        var cssLines = [];
        cssLines.push( identifier );
        cssLines = cssLines.concat( cssStyles );
        cssLines.push( "}" );

        writingScope.css[ element.id ] = cssLines;
    }

    function writeCssStyleTag( writingScope ) {
        var head = _parameter_Document.getElementsByTagName( "head" )[ 0 ],
            cssLines = [];

        for ( var elementId in writingScope.css ) {
            if ( writingScope.css.hasOwnProperty( elementId ) ) {
                cssLines = cssLines.concat( writingScope.css[ elementId ] );
            }
        }

        var style = createElement( head, "style" );
        style.type = "text/css";
        style.appendChild( _parameter_Document.createTextNode( cssLines.join( _string.newLine ) ) );
    }

    function clearCssStyleTagsFromHead() {
        var styles = [].slice.call( _parameter_Document.getElementsByTagName( "styles" ) ),
            stylesLength = styles.length;

        for ( var styleIndex = 0; styleIndex < stylesLength; styleIndex++ ) {
            styles[ styleIndex ].parentNode.removeChild( styles[ styleIndex ] );
        }
    }

    function checkedForUnusedTemplateData( writingScope ) {
        var templateDataKeysProcessedLength = writingScope.templateDataKeysProcessed.length;

        if ( writingScope.templateDataKeysLength > templateDataKeysProcessedLength ) {
            for ( var templateDataKeyIndex = 0; templateDataKeyIndex < writingScope.templateDataKeysLength; templateDataKeyIndex++ ) {
                var templateDataKey = writingScope.templateDataKeys[ templateDataKeyIndex ];

                if ( writingScope.templateDataKeysProcessed.indexOf( templateDataKey ) === _value.notFound ) {
                    console.warn( _configuration.variableWarningText.replace( "{{variable_name}}", templateDataKey ) );
                }
            }
        }
    }

    function processRemainingVariablesForDefaults( element ) {
        var remainingVariables = getTemplateVariables( element.innerHTML ),
            remainingVariablesLength = remainingVariables.length;
        
        for ( var remainingVariableIndex = 0; remainingVariableIndex < remainingVariablesLength; remainingVariableIndex++ ) {
            var variable = remainingVariables[ remainingVariableIndex ];

            if ( variable.indexOf( _string.variableDefault ) > _value.notFound ) {
                var defaultValue = variable
                    .replace( _string.variableStart, _string.empty )
                    .replace( _string.variableEnd, _string.empty )
                    .split( _string.variableDefault )[ 1 ];

                if ( isDefinedString( defaultValue ) ) {
                    element.innerHTML = element.innerHTML.replace( variable, defaultValue.trim() );
                }
            }
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * JSON - Templates
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getTemplateVariables( data ) {
        var result = [];

        if ( isDefinedString( data ) ) {
            var startIndex = 0,
                endIndex = 0;

            while ( startIndex > _value.notFound ) {
                startIndex = data.indexOf( _string.variableStart, endIndex );

                if ( startIndex > _value.notFound ) {
                    endIndex = data.indexOf( _string.variableEnd, startIndex );

                    if ( endIndex > _value.notFound ) {
                        var variable = data.substring( startIndex, endIndex + _string.variableEnd.length );

                        result.push( variable );

                        endIndex += 2;
                    }
                }
            }
        }

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Triggering Custom Events
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function fireCustomTrigger( triggerFunction ) {
        if ( isDefinedFunction( triggerFunction ) ) {
            triggerFunction.apply( null, [].slice.call( arguments, 1 ) );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Element Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function createElement( container, type ) {
        var nodeType = type.toLowerCase(),
            isText = nodeType === "text";

        if ( !_elements_Type.hasOwnProperty( nodeType ) ) {
            _elements_Type[ nodeType ] = isText ? _parameter_Document.createTextNode( _string.empty ) : _parameter_Document.createElement( nodeType );
        }

        var result = _elements_Type[ nodeType ].cloneNode( false );

        container.appendChild( result );

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Validation
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function isDefined( value ) {
        return value !== null && value !== undefined && value !== _string.empty;
    }

    function isDefinedObject( object ) {
        return isDefined( object ) && typeof object === "object";
    }

    function isDefinedBoolean( object ) {
        return isDefined( object ) && typeof object === "boolean";
    }

    function isDefinedString( object ) {
        return isDefined( object ) && typeof object === "string";
    }

    function isDefinedFunction( object ) {
        return isDefined( object ) && typeof object === "function";
    }

    function isDefinedNumber( object ) {
        return isDefined( object ) && typeof object === "number";
    }

    function isDefinedArray( object ) {
        return isDefinedObject( object ) && object instanceof Array;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * String Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function newGuid() {
        var result = [];

        for ( var charIndex = 0; charIndex < 32; charIndex++ ) {
            if ( charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20 ) {
                result.push( _string.dash );
            }

            var character = _parameter_Math.floor( _parameter_Math.random() * 16 ).toString( 16 );
            result.push( character );
        }

        return result.join( _string.empty );
    }

    function startsWithAnyCase( data, start ) {
        return data.substring( 0, start.length ).toLowerCase() === start.toLowerCase();
    }

    function replaceAll( string, find, replace ) {
        return string.replace( new RegExp( find.replace( _string.variableDefault, "[" + _string.variableDefault + "]" ), "g" ), replace );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Default Parameter/Option Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getDefaultBoolean( value, defaultValue ) {
        return isDefinedBoolean( value ) ? value : defaultValue;
    }

    function getDefaultNumber( value, defaultValue ) {
        return isDefinedNumber( value ) ? value : defaultValue;
    }

    function getDefaultString( value, defaultValue ) {
        return isDefinedString( value ) ? value : defaultValue;
    }

    function getDefaultArray( value, defaultValue ) {
        return isDefinedArray( value ) ? value : defaultValue;
    }

    function getDefaultObject( value, defaultValue ) {
        return isDefinedObject( value ) ? value : defaultValue;
    }

    function getDefaultFunction( value, defaultValue ) {
        return isDefinedFunction( value ) ? value : defaultValue;
    }

    function getDefaultStringOrArray( value, defaultValue ) {
        if ( isDefinedString( value ) ) {
            value = value.split( _string.space );

            if ( value.length === 0 ) {
                value = defaultValue;
            }

        } else {
            value = getDefaultArray( value, defaultValue );
        }

        return value;
    }

    function getObjectFromString( objectString ) {
        var parsed = true,
            result = null;

        try {
            if ( isDefinedString( objectString ) ) {
                result = _parameter_JSON.parse( objectString );
            }

        } catch ( e1 ) {

            try {
                result = eval( "(" + objectString + ")" );

                if ( isDefinedFunction( result ) ) {
                    result = result();
                }
                
            } catch ( e2 ) {
                if ( !_configuration.safeMode ) {
                    console.error( _configuration.objectErrorText.replace( "{{error_1}}",  e1.message ).replace( "{{error_2}}",  e2.message ) );
                    parsed = false;
                }
                
                result = null;
            }
        }

        return {
            parsed: parsed,
            result: result
        };
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Binding
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * renderAll().
     * 
     * Finds all the elements with the correct binding attribute and renders the JSON as HTML.
     * 
     * @public
     * 
     * @returns     {Object}                                                The JHson.js class instance.
     */
    _public.renderAll = function() {
        render();

        return _public;
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  JSON
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * json().
     * 
     * Returns all the chained functions that will allow an HTML DOM element to be converted to JSON.
     * 
     * @public
     * 
     * @returns     {Object}                                                The JSON properties object.
     */
    _public.json = function() {
        var properties = getDefaultJsonProperties();

        return {
            /**
             * includeAttributes().
             * 
             * States if the attributes should be included.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            includeAttributes: function( flag ) {
                properties.includeAttributes = getDefaultBoolean( flag, properties.includeAttributes );

                return this;
            },

            /**
             * includeCssProperties().
             * 
             * States if the CSS style properties should be included.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to false).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            includeCssProperties: function( flag ) {
                properties.includeCssProperties = getDefaultBoolean( flag, properties.includeCssProperties );

                return this;
            },

            /**
             * includeText().
             * 
             * States if the node text should be included.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            includeText: function( flag ) {
                properties.includeText = getDefaultBoolean( flag, properties.includeText );

                return this;
            },

            /**
             * includeChildren().
             * 
             * States if the children should be included.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            includeChildren: function( flag ) {
                properties.includeChildren = getDefaultBoolean( flag, properties.includeChildren );

                return this;
            },

            /**
             * friendlyFormat().
             * 
             * States if the JSON should be formatted in an easy-to-read layout.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            friendlyFormat: function( flag ) {
                properties.friendlyFormat = getDefaultBoolean( flag, properties.friendlyFormat );

                return this;
            },

            /**
             * indentSpaces().
             * 
             * States the total indent spaces that should be used for the friendly format JSON.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The spaces value that should be used (defaults to 2).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            indentSpaces: function( spaces ) {
                properties.indentSpaces = getDefaultNumber( spaces, properties.indentSpaces );

                return this;
            },

            /**
             * ignoreNodeTypes().
             * 
             * States the node types that should not be included in the JSON.
             * 
             * @public
             * 
             * @param       {Object}    types                               The node types to ignore (can be an array of strings, or a space separated string, and defaults to []).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            ignoreNodeTypes: function( types ) {
                properties.ignoreNodeTypes = getDefaultStringOrArray( types, properties.ignoreNodeTypes );

                return this;
            },

            /**
             * ignoreCssProperties().
             * 
             * States the CSS properties that should not be included in the JSON.
             * 
             * @public
             * 
             * @param       {Object}    cssProperties                       The CSS properties to ignore (can be an array of strings, or a space separated string, and defaults to []).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            ignoreCssProperties: function( cssProperties ) {
                properties.ignoreCssProperties = getDefaultStringOrArray( cssProperties, properties.ignoreCssProperties );

                return this;
            },

            /**
             * ignoreAttributes().
             * 
             * States the attributes that should not be included in the JSON.
             * 
             * @public
             * 
             * @param       {Object}    attributes                          The attributes to ignore (can be an array of strings, or a space separated string, and defaults to []).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            ignoreAttributes: function( attributes ) {
                properties.ignoreAttributes = getDefaultStringOrArray( attributes, properties.ignoreAttributes );

                return this;
            },

            /**
             * generateUniqueMissingIds().
             * 
             * States if the JSON should include unique IDs for DOM elements that don't have them set already.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            generateUniqueMissingIds: function( flag ) {
                properties.generateUniqueMissingIds = getDefaultBoolean( flag, properties.generateUniqueMissingIds );

                return this;
            },

            /**
             * get().
             * 
             * Uses all the options selected via the chained functions to get the JSON from the HTML DOM element.
             * 
             * @public
             * 
             * @param       {Object}    element                             The DOM element to get the JSON for.
             * 
             * @returns     {string}                                        The JSON string.
             */
            get: function( element ) {
                return getJSON( element, properties );
            },

            /**
             * getVariables().
             * 
             * Uses all the options selected via the chained functions to get the template variables from a JSON string.
             * 
             * @public
             * 
             * @param       {string}    json                                The JSON to get the template variables from.
             * 
             * @returns     {string[]}                                      The template variables.
             */
            getVariables: function( json ) {
                return getTemplateVariables( json );
            }
        };
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  HTML
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * html().
     * 
     * Returns all the chained functions that will allow JSON to be written as HTML DOM elements.
     * 
     * @public
     * 
     * @returns     {Object}                                                The HTML properties object.
     */
    _public.html = function() {
        var properties = getDefaultHtmlProperties();

        return {
            /**
             * json().
             * 
             * States the JSON that should be written as HTML DOM elements.
             * 
             * @public
             * 
             * @param       {string}    json                                The JSON that should be converted to HTML.
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            json: function( json ) {
                properties.json = getDefaultString( json, properties.json );

                return this;
            },

            /**
             * templateData().
             * 
             * States the template data that should be used inside each HTML DOM elements HTML.
             * 
             * @public
             * 
             * @param       {Object}    templateData                        The template data to set inside each node's HTML.
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            templateData: function( templateData ) {
                properties.templateData = getDefaultObject( templateData, properties.templateData );

                return this;
            },

            /**
             * removeOriginalAttributes().
             * 
             * States if the original attributes on the element should be removed.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            removeOriginalAttributes: function( flag ) {
                properties.removeOriginalAttributes = getDefaultBoolean( flag, properties.removeOriginalAttributes );

                return this;
            },

            /**
             * clearOriginalHTML().
             * 
             * States if the original HTML in the element should be cleared.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            clearOriginalHTML: function( flag ) {
                properties.clearOriginalHTML = getDefaultBoolean( flag, properties.clearOriginalHTML );

                return this;
            },

            /**
             * addCssToHead().
             * 
             * States if the CSS style properties should be written to a "style" tag in the HTML documents HEAD DOM element.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to false).
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            addCssToHead: function( flag ) {
                properties.addCssToHead = getDefaultBoolean( flag, properties.addCssToHead );

                return this;
            },

            /**
             * clearCssFromHead().
             * 
             * States if all the CSS style tags should be cleared from the HTML documents HEAD DOM element.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to false).
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            clearCssFromHead: function( flag ) {
                properties.clearCssFromHead = getDefaultBoolean( flag, properties.clearCssFromHead );

                return this;
            },

            /**
             * logTemplateDataWarnings().
             * 
             * States if the template data variables not found in any data are logged as warnings.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            logTemplateDataWarnings: function( flag ) {
                properties.logTemplateDataWarnings = getDefaultBoolean( flag, properties.logTemplateDataWarnings );

                return this;
            },

            /**
             * addAttributes().
             * 
             * States if the attributes should be written for each element.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            addAttributes: function( flag ) {
                properties.addAttributes = getDefaultBoolean( flag, properties.addAttributes );

                return this;
            },

            /**
             * addCssProperties().
             * 
             * States if the CSS properties should be written for each element.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            addCssProperties: function( flag ) {
                properties.addCssProperties = getDefaultBoolean( flag, properties.addCssProperties );

                return this;
            },

            /**
             * addText().
             * 
             * States if the text should be written for each element.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            addText: function( flag ) {
                properties.addText = getDefaultBoolean( flag, properties.addText );

                return this;
            },

            /**
             * addChildren().
             * 
             * States if the children should be written for each element.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            addChildren: function( flag ) {
                properties.addChildren = getDefaultBoolean( flag, properties.addChildren );

                return this;
            },

            /**
             * write().
             * 
             * Uses all the options selected via the chained functions to convert the JSON into HTML DOM elements.
             * 
             * @public
             * 
             * @param       {Object}    element                             The DOM element to add the new JSON HTML nodes to.
             * 
             * @returns     {string}                                        The JHson.js class instance.
             */
            write: function( element ) {
                return writeHtml( element, properties );
            },

            /**
             * getVariables().
             * 
             * Uses all the options selected via the chained functions to get the template variables from a HTML DOM element.
             * 
             * @public
             * 
             * @param       {Object}    element                             The DOM element to get the template variables from.
             * 
             * @returns     {string[]}                                      The template variables.
             */
            getVariables: function( element ) {
                var result = [];

                if ( isDefinedObject( element ) ) {
                    result = getTemplateVariables( element.innerHTML );
                }
                
                return result;
            }
        };
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Configuration
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * setConfiguration().
     * 
     * Sets the specific configuration options that should be used.
     * 
     * @public
     * 
     * @param       {Object}    newConfiguration                            All the configuration options that should be set (refer to "Options" documentation for properties).
     * 
     * @returns     {Object}                                                The JHson.js class instance.
     */
    _public.setConfiguration = function( newConfiguration ) {
        var configurationChanges = false;

        if ( isDefinedObject( newConfiguration ) ) {
            for ( var propertyName in newConfiguration ) {
                if ( newConfiguration.hasOwnProperty( propertyName ) && _configuration.hasOwnProperty( propertyName ) && newConfiguration[ propertyName ] !== _configuration[ propertyName ] ) {
                    _configuration[ propertyName ] = newConfiguration[ propertyName ];
                    configurationChanges = true;
                }
            }
    
            if ( configurationChanges ) {
                buildDefaultConfiguration( _configuration );
            }
        }

        return _public;
    };

    function buildDefaultConfiguration( newConfiguration ) {
        _configuration = !isDefinedObject( newConfiguration ) ? {} : newConfiguration;
        _configuration.safeMode = getDefaultBoolean( _configuration.safeMode, true );
        _configuration.domElementTypes = getDefaultStringOrArray( _configuration.domElementTypes, [ "*" ] );
        _configuration.formattingNodeTypes = getDefaultStringOrArray( _configuration.formattingNodeTypes, [
            "b",
            "strong",
            "i",
            "em",
            "mark",
            "small",
            "del",
            "ins",
            "sub",
            "sup"
        ] );

        buildDefaultConfigurationStrings();
    }

    function buildDefaultConfigurationStrings() {
        _configuration.variableWarningText = getDefaultString( _configuration.variableWarningText, "Template variable {{variable_name}} not found." );
        _configuration.objectErrorText = getDefaultString( _configuration.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}" );
        _configuration.attributeNotValidErrorText = getDefaultString( _configuration.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object." );
        _configuration.attributeNotSetErrorText = getDefaultString( _configuration.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly." );        
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Additional Data
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * getVersion().
     * 
     * Returns the version of JHson.js.
     * 
     * @public
     * 
     * @returns     {string}                                                The version number.
     */
    _public.getVersion = function() {
        return "1.2.2";
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize JHson.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( function ( documentObject, windowObject, jsonObject, mathObject ) {
        _parameter_Document = documentObject;
        _parameter_Window = windowObject;
        _parameter_JSON = jsonObject;
        _parameter_Math = mathObject;

        buildDefaultConfiguration();

        _parameter_Document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !isDefined( _parameter_Window.$jhson ) ) {
            _parameter_Window.$jhson = _public;
        }

    } ) ( document, window, JSON, Math );
} )();