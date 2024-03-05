/**
 * JHson.js
 * 
 * A JavaScript library for converting HTML to JSON, and JSON to HTML, with templating, attributes, and CSS support.
 * 
 * @file        jhson.js
 * @version     v0.6.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


( function() {
    var _this = this,

        // Variables: Constructor Parameters
        _parameter_Document = null,
        _parameter_Window = null,
        _parameter_JSON = null,
        _parameter_Math = null,

        // Variables: Configuration
        _configuration = {},

        // Variables: Elements
        _elements_Type = {},

        // Variables: Strings
        _string = {
            empty: "",
            space: " ",
            newLine: "\n"
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
        };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * JSON - Get
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

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
        var attributesLength = element.attributes.length;

        if ( element.nodeName.toLowerCase() === "textarea" && isDefined( element.value ) ) {
            result[ _json.text ] = element.value;
        }

        for ( var attributeIndex = 0; attributeIndex < attributesLength; attributeIndex++ ) {
            var attribute = element.attributes[ attributeIndex ];

            if ( isDefinedString( attribute.nodeName ) && properties.ignoreAttributes.indexOf( attribute.nodeName ) === _value.notFound ) {
                result[ _json.attribute + attribute.nodeName ] = attribute.nodeValue;
            }
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

    function writeHtml( element, properties ) {
        var writingScope = {
            css: {},
            templateDataKeys: [],
            templateDataKeysLength: 0,
            templateDataKeysProcessed: []
        };

        if ( isDefinedObject( element ) && isDefinedString( properties.json ) ) {
            var convertedJsonObject = getObjectFromString( properties.json );

            if ( properties.clearCssFromHead ) {
                clearCssStyleTagsFromHead();
            }

            if ( isDefinedObject( properties.templateData ) ) {
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

            if ( convertedJsonObject.parsed && isDefinedObject( convertedJsonObject.result ) ) {
                for ( var key in convertedJsonObject.result ) {
                    if ( key === element.nodeName.toLowerCase() ) {
                        if ( properties.removeAttributes ) {
                            while ( element.attributes.length > 0 ) {
                                element.removeAttribute( element.attributes[ 0 ].name );
                            }
                        }

                        if ( properties.clearHTML ) {
                            element.innerHTML = _string.empty;
                        }

                        writeNode( element, convertedJsonObject.result[ key ], properties, writingScope );
                    }
                }
            }

            if ( properties.addCssToHead ) {
                writeCssStyleTag( writingScope );
            }

            if ( properties.logTemplateDataWarnings ) {
                checkedForUnusedTemplateData( writingScope );
            }
        }

        return _this;
    }

    function writeNode( element, jsonObject, properties, writingScope ) {
        var cssStyles = [];

        for ( var jsonKey in jsonObject ) {
            if ( startsWithAnyCase( jsonKey, _json.attribute ) ) {
                var attributeName = jsonKey.replace( _json.attribute, _string.empty ),
                    attributeValue = jsonObject[ jsonKey ];

                element.setAttribute( attributeName, attributeValue );

            } else if ( startsWithAnyCase( jsonKey, _json.cssStyle ) ) {
                var cssStyleName = jsonKey.replace( _json.cssStyle, _string.empty );

                if ( !properties.addCssToHead ) {
                    element.style[ cssStyleName ] = jsonObject[ jsonKey ];
                } else {
                    cssStyles.push( cssStyleName + ":" + jsonObject[ jsonKey ] + ";" );
                }

            } else if ( jsonKey === _json.text ) {
                element.innerHTML = jsonObject[ jsonKey ];

                if ( writingScope.templateDataKeysLength > 0 ) {
                    for ( var templateDataKeyIndex = 0; templateDataKeyIndex <  writingScope.templateDataKeysLength; templateDataKeyIndex++ ) {
                        var templateDataKey = writingScope.templateDataKeys[ templateDataKeyIndex ];

                        if ( properties.templateData.hasOwnProperty( templateDataKey ) && element.innerHTML.indexOf( templateDataKey ) > _value.notFound ) {
                            element.innerHTML = replaceAll( element.innerHTML, templateDataKey, properties.templateData[ templateDataKey ] );

                            if ( writingScope.templateDataKeysProcessed.indexOf( templateDataKey ) === _value.notFound ) {
                                writingScope.templateDataKeysProcessed.push( templateDataKey );
                            }
                        }
                    }
                }

            } else if ( jsonKey === _json.children ) {
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

        if ( cssStyles.length > 0 ) {
            storeCssStyles( element, cssStyles, writingScope );
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
        return string.replace( new RegExp( find, "g" ), replace );
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
                    console.error( "Errors in object: " + e1.message + ", " + e2.message );
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
    this.json = function() {
        var scope = null;

        ( function() {
            scope = this;

            var __properties = {
                includeAttributes: true,
                includeCssProperties: false,
                includeText: true,
                includeChildren: true,
                friendlyFormat: true,
                indentSpaces: 2,
                ignoreNodeTypes: [],
                ignoreCssProperties: [],
                ignoreAttributes: []
            };

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
            scope.includeAttributes = function( flag ) {
                __properties.includeAttributes = getDefaultBoolean( flag, __properties.includeAttributes );

                return this;
            };

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
            scope.includeCssProperties = function( flag ) {
                __properties.includeCssProperties = getDefaultBoolean( flag, __properties.includeCssProperties );

                return this;
            };

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
            scope.includeText = function( flag ) {
                __properties.includeText = getDefaultBoolean( flag, __properties.includeText );

                return this;
            };

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
            scope.includeChildren = function( flag ) {
                __properties.includeChildren = getDefaultBoolean( flag, __properties.includeChildren );

                return this;
            };

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
            scope.friendlyFormat = function( flag ) {
                __properties.friendlyFormat = getDefaultBoolean( flag, __properties.friendlyFormat );

                return this;
            };

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
            scope.indentSpaces = function( spaces ) {
                __properties.indentSpaces = getDefaultNumber( spaces, __properties.indentSpaces );

                return this;
            };

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
            scope.ignoreNodeTypes = function( types ) {
                __properties.ignoreNodeTypes = getDefaultStringOrArray( types, __properties.ignoreNodeTypes );

                return this;
            };

            /**
             * ignoreCssProperties().
             * 
             * States the CSS properties that should not be included in the JSON.
             * 
             * @public
             * 
             * @param       {Object}    properties                          The CSS properties to ignore (can be an array of strings, or a space separated string, and defaults to []).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            scope.ignoreCssProperties = function( properties ) {
                __properties.ignoreCssProperties = getDefaultStringOrArray( properties, __properties.ignoreCssProperties );

                return this;
            };

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
            scope.ignoreAttributes = function( attributes ) {
                __properties.ignoreAttributes = getDefaultStringOrArray( attributes, __properties.ignoreAttributes );

                return this;
            };

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
            scope.get = function( element ) {
                return getJSON( element, __properties );
            };
        } )();
        
        return scope;
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
    this.html = function() {
        var scope = null;

        ( function() {
            scope = this;
            
            var __properties = {
                json: _string.empty,
                templateData: {},
                removeAttributes: true,
                clearHTML: true,
                addCssToHead: false,
                clearCssFromHead: false,
                logTemplateDataWarnings: false
            };

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
            scope.json = function( json ) {
                __properties.json = getDefaultString( json, __properties.json );

                return this;
            };

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
            scope.templateData = function( templateData ) {
                __properties.templateData = getDefaultObject( templateData, __properties.templateData );

                return this;
            };

            /**
             * removeAttributes().
             * 
             * States if the original attributes on the element should be removed.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            scope.removeAttributes = function( flag ) {
                __properties.removeAttributes = getDefaultBoolean( flag, __properties.removeAttributes );

                return this;
            };

            /**
             * clearHTML().
             * 
             * States if the original HTML in the element should be cleared.
             * 
             * @public
             * 
             * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            scope.clearHTML = function( flag ) {
                __properties.clearHTML = getDefaultBoolean( flag, __properties.clearHTML );

                return this;
            };

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
            scope.addCssToHead = function( flag ) {
                __properties.addCssToHead = getDefaultBoolean( flag, __properties.addCssToHead );

                return this;
            };

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
            scope.clearCssFromHead = function( flag ) {
                __properties.clearCssFromHead = getDefaultBoolean( flag, __properties.clearCssFromHead );

                return this;
            };

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
            scope.logTemplateDataWarnings = function( flag ) {
                __properties.logTemplateDataWarnings = getDefaultBoolean( flag, __properties.logTemplateDataWarnings );

                return this;
            };

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
            scope.write = function( element ) {
                return writeHtml( element, __properties );
            };
        } )();
        
        return scope;
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
    this.setConfiguration = function( newConfiguration ) {
        var configurationChanges = false;

        for ( var propertyName in newConfiguration ) {
            if ( newConfiguration.hasOwnProperty( propertyName ) && _configuration.hasOwnProperty( propertyName ) && newConfiguration[ propertyName ] !== _configuration[ propertyName ] ) {
                _configuration[ propertyName ] = newConfiguration[ propertyName ];
                configurationChanges = true;
            }
        }

        if ( configurationChanges ) {
            buildDefaultConfiguration( _configuration );
        }

        return this;
    };

    function buildDefaultConfiguration( newConfiguration ) {
        _configuration = !isDefinedObject( newConfiguration ) ? {} : newConfiguration;
        _configuration.safeMode = getDefaultBoolean( _configuration.safeMode, true );
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
    this.getVersion = function() {
        return "0.6.0";
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

        if ( !isDefined( _parameter_Window.$jhson ) ) {
            _parameter_Window.$jhson = this;
        }

    } ) ( document, window, JSON, Math );
} )();