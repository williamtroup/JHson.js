/**
 * JHson.js
 * 
 * A JavaScript library for converting HTML to JSON, and JSON to HTML, with templating, attributes, and CSS support.
 * 
 * @file        jhson.js
 * @version     v0.3.0
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

        // Variables: Configuration
        _configuration = {},

        // Variables: Elements
        _elements_Type = {},

        // Variables: Strings
        _string = {
            empty: "",
            space: " "
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
                result = _parameter_JSON.stringify( resultJson, null, _configuration.jsonIndentationSpaces );
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
            getElementAttributes( element, result );
        }

        if ( properties.includeCssStyles ) {
            getElementCssStyles( element, result, parentCssStyles );
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

    function getElementAttributes( element, result ) {
        var attributesLength = element.attributes.length;

        if ( element.nodeName.toLowerCase() === "textarea" && isDefined( element.value ) ) {
            result[ _json.text ] = element.value;
        }

        for ( var attributeIndex = 0; attributeIndex < attributesLength; attributeIndex++ ) {
            var attribute = element.attributes[ attributeIndex ];

            if ( isDefinedString( attribute.nodeName ) ) {
                result[ _json.attribute + attribute.nodeName ] = attribute.nodeValue;
            }
        }
    }

    function getElementCssStyles( element, result, parentCssStyles ) {
        if ( _parameter_Window.getComputedStyle ) {
            var cssComputedStyles = _parameter_Document.defaultView.getComputedStyle( element ),
                cssComputedStylesLength = cssComputedStyles.length;

            for ( var cssComputedStyleIndex = 0; cssComputedStyleIndex < cssComputedStylesLength; cssComputedStyleIndex++ ) {
                var cssComputedStyleName = cssComputedStyles[ cssComputedStyleIndex ];

                if ( _configuration.cssPropertiesToIgnore.indexOf( cssComputedStyleName ) === _value.notFound ) {
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

            if ( _configuration.formattingNodeTypes.indexOf( childElementData.nodeName.toLowerCase() ) > _value.notFound ) {
                totalChildren++;
            } else {

                if ( _configuration.nodeTypesToIgnore.indexOf( childElementData.nodeName.toLowerCase() ) === _value.notFound ) {
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
    
                if ( element.innerText === element.innerHTML ) {
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
        if ( isDefinedObject( element ) && isDefinedString( properties.json ) ) {
            var convertedJsonObject = getObjectFromString( properties.json ),
                templateDataKeys = [];

            if ( isDefinedObject( properties.templateData ) ) {
                for ( var templateDataKey in properties.templateData ) {
                    if ( properties.templateData.hasOwnProperty( templateDataKey ) ) {
                        templateDataKeys.push( templateDataKey );
                    }
                }

                templateDataKeys = templateDataKeys.sort( function( a, b ) {
                    return b.length - a.length;
                } );
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

                        writeNode( element, convertedJsonObject.result[ key ], templateDataKeys, properties.templateData );
                    }
                }
            }
        }

        return _this;
    }

    function writeNode( element, jsonObject, templateDataKeys, templateData ) {
        var templateDataKeysLength = templateDataKeys.length;

        for ( var jsonKey in jsonObject ) {
            if ( startsWithAnyCase( jsonKey, _json.attribute ) ) {
                var attributeName = jsonKey.replace( _json.attribute, _string.empty ),
                    attributeValue = jsonObject[ jsonKey ];

                element.setAttribute( attributeName, attributeValue );

            } else if ( startsWithAnyCase( jsonKey, _json.cssStyle ) ) {
                var cssStyleName = jsonKey.replace( _json.cssStyle, _string.empty ),
                    cssStyleValue = jsonObject[ jsonKey ];

                element.style[ cssStyleName ] = cssStyleValue;

            } else if ( jsonKey === _json.text ) {
                element.innerHTML = jsonObject[ jsonKey ];

                if ( templateDataKeysLength > 0 ) {
                    for ( var templateDataKeyIndex = 0; templateDataKeyIndex <  templateDataKeysLength; templateDataKeyIndex++ ) {
                        var templateDataKey = templateDataKeys[ templateDataKeyIndex ];

                        if ( templateData.hasOwnProperty( templateDataKey ) ) {
                            element.innerHTML = replaceAll( element.innerHTML, templateDataKey, templateData[ templateDataKey ] );
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

                            writeNode( childElement, childJson[ childJsonKey ], templateDataKeys, templateData );
                        }
                    }
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
        var result = null;

        ( function() {
            result = this;

            var __properties = {
                includeAttributes: true,
                includeCssStyles: false,
                includeText: true,
                includeChildren: true,
                friendlyFormat: true,
            };

            /**
             * includeAttributes().
             * 
             * States if the attributes should be included.
             * 
             * @public
             * 
             * @param       {string}    flag                                The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            this.includeAttributes = function( flag ) {
                __properties.includeAttributes = getDefaultBoolean( flag, true );

                return this;
            };

            /**
             * includeCssStyles().
             * 
             * States if the CSS style properties should be included.
             * 
             * @public
             * 
             * @param       {string}    flag                                The boolean flag that states the condition (defaults to false).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            this.includeCssStyles = function( flag ) {
                __properties.includeCssStyles = getDefaultBoolean( flag, false );

                return this;
            };

            /**
             * includeText().
             * 
             * States if the node text should be included.
             * 
             * @public
             * 
             * @param       {string}    flag                                The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            this.includeText = function( flag ) {
                __properties.includeText = getDefaultBoolean( flag, true );

                return this;
            };

            /**
             * includeChildren().
             * 
             * States if the children should be included.
             * 
             * @public
             * 
             * @param       {string}    flag                                The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            this.includeChildren = function( flag ) {
                __properties.includeChildren = getDefaultBoolean( flag, true );

                return this;
            };

            /**
             * friendlyFormat().
             * 
             * States if the JSON should be formatted in an easy-to-read layout.
             * 
             * @public
             * 
             * @param       {string}    flag                                The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The JSON properties object.
             */
            this.friendlyFormat = function( flag ) {
                __properties.friendlyFormat = getDefaultBoolean( flag, true );

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
            this.get = function( element ) {
                return getJSON( element, __properties );
            };
        } )();
        
        return result;
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
        var result = null;

        ( function() {
            result = this;
            
            var __properties = {
                json: _string.empty,
                templateData: {},
                removeAttributes: true,
                clearHTML: true
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
            this.json = function( json ) {
                __properties.json = getDefaultString( json, _string.empty );
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
            this.templateData = function( templateData ) {
                __properties.templateData = getDefaultObject( templateData, {} );
                return this;
            };

            /**
             * removeAttributes().
             * 
             * States if the original attributes on the element should be removed.
             * 
             * @public
             * 
             * @param       {string}    flag                                The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            this.removeAttributes = function( flag ) {
                __properties.removeAttributes = getDefaultBoolean( flag, true );
                return this;
            };

            /**
             * clearHTML().
             * 
             * States if the original HTML in the element should be cleared.
             * 
             * @public
             * 
             * @param       {string}    flag                                The boolean flag that states the condition (defaults to true).
             * 
             * @returns     {Object}                                        The HTML properties object.
             */
            this.clearHTML = function( flag ) {
                __properties.clearHTML = getDefaultBoolean( flag, true );
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
            this.write = function( element ) {
                return writeHtml( element, __properties );
            };
        } )();
        
        return result;
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
        _configuration.nodeTypesToIgnore = getDefaultStringOrArray( _configuration.nodeTypesToIgnore, [] );
        _configuration.cssPropertiesToIgnore = getDefaultStringOrArray( _configuration.cssPropertiesToIgnore, [] );
        _configuration.jsonIndentationSpaces = getDefaultNumber( _configuration.jsonIndentationSpaces, 2 );
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
        return "0.3.0";
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize JHson.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( function ( documentObject, windowObject, jsonObject ) {
        _parameter_Document = documentObject;
        _parameter_Window = windowObject;
        _parameter_JSON = jsonObject;

        buildDefaultConfiguration();

        if ( !isDefined( _parameter_Window.$jhson ) ) {
            _parameter_Window.$jhson = this;
        }

    } ) ( document, window, JSON );
} )();