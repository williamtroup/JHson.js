/**
 * JHson.js
 * 
 * A lightweight JavaScript library.
 * 
 * @file        jhson.js
 * @version     v0.1.0
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

        // Variables: Strings
        _string = {
            empty: "",
            space: " "
        },

        // Variables: Values
        _value = {
            notFound: -1
        },

        // Variables: Formatting Nodes
        _formatting_Nodes = [
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
        ];


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * JSON - Get
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getJSON( element, includeAttributes, includeCssStyles, includeText, friendlyFormat ) {
        var result = _string.empty,
            resultJson = {},
            elementJson = getElementObject( element, includeAttributes, includeCssStyles, includeText, {} );

        resultJson[ elementJson.nodeName ] = elementJson.nodeValues;

        if ( friendlyFormat ) {
            result = _parameter_JSON.stringify( resultJson, null, _configuration.jsonIndentationSpaces );
        } else {
            result = _parameter_JSON.stringify( resultJson );
        }
        
        return result;
    }

    function getElementObject( element, includeAttributes, includeCssStyles, includeText, parentCssStyles ) {
        var result = {},
            childrenLength = element.children.length,
            childrenAdded = 0;

        if ( includeAttributes ) {
            getElementAttributes( element, result );
        }

        if ( includeCssStyles ) {
            getElementCssStyles( element, result, parentCssStyles );
        }

        if ( childrenLength > 0 ) {
            childrenAdded = getElementChildren( element, result, childrenLength, includeAttributes, includeCssStyles, includeText, parentCssStyles );
        }

        if ( includeText ) {
            getElementText( element, result, childrenAdded );
        }

        if ( isDefined( result.children ) && result.children.length === 0 ) {
            delete result.children;
        }

        return {
            nodeName: element.nodeName.toLowerCase(),
            nodeValues: result
        };
    }

    function getElementAttributes( element, result ) {
        var attributesLength = element.attributes.length;

        for ( var attributeIndex = 0; attributeIndex < attributesLength; attributeIndex++ ) {
            var attribute = element.attributes[ attributeIndex ];

            if ( isDefinedString( attribute.nodeName ) ) {
                result[ "@" + attribute.nodeName ] = attribute.nodeValue;
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
                    var cssComputedStyleNameStorage = "$" + cssComputedStyleName,
                        cssComputedValue = cssComputedStyles.getPropertyValue( cssComputedStyleName );

                    if ( !parentCssStyles.hasOwnProperty( cssComputedStyleNameStorage ) || parentCssStyles[ cssComputedStyleNameStorage ] !== cssComputedValue ) {
                        result[ cssComputedStyleNameStorage ] = cssComputedValue;
                        parentCssStyles[ cssComputedStyleNameStorage ] = result[ cssComputedStyleNameStorage ];
                    }
                }
            }
        }
    }

    function getElementChildren( element, result, childrenLength, includeAttributes, includeCssStyles, includeText, parentCssStyles ) {
        var totalChildren = 0;
        
        result.children = [];

        for ( var childrenIndex = 0; childrenIndex < childrenLength; childrenIndex++ ) {
            var child = element.children[ childrenIndex ],
                childElementData = getElementObject( child, includeAttributes, includeCssStyles, includeText, getParentCssStylesCopy( parentCssStyles ) ),
                addChild = false;

            if ( _formatting_Nodes.indexOf( childElementData.nodeName.toLowerCase() ) > _value.notFound ) {
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

                result.children.push( childJson );
            }
        }

        return totalChildren;
    }

    function getElementText( element, result, childrenAdded ) {
        if ( isDefinedString( element.innerText ) ) {
            if ( childrenAdded > 0 && isDefined( result.children ) && result.children.length === 0 ) {
                result[ "#text" ] = element.innerHTML;
            } else {
    
                if ( element.innerText === element.innerHTML ) {
                    result[ "#text" ] = element.innerText;
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
     * JSON - Write
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function write( parentElement, json ) {
        return _this;
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
     * Default Parameter/Option Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getDefaultString( value, defaultValue ) {
        return isDefinedString( value ) ? value : defaultValue;
    }

    function getDefaultBoolean( value, defaultValue ) {
        return isDefinedBoolean( value ) ? value : defaultValue;
    }

    function getDefaultFunction( value, defaultValue ) {
        return isDefinedFunction( value ) ? value : defaultValue;
    }

    function getDefaultArray( value, defaultValue ) {
        return isDefinedArray( value ) ? value : defaultValue;
    }

    function getDefaultNumber( value, defaultValue ) {
        return isDefinedNumber( value ) ? value : defaultValue;
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


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  JSON
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * get().
     * 
     * Gets the JSON from a parent DOM element.
     * 
     * @public
     * 
     * @param       {Object}    element                                     The DOM element to get the JSON for.
     * @param       {boolean}   [includeAttributes]                         Should the Attributes be included in the JSON (defaults to true).
     * @param       {boolean}   [includeCssStyles]                          Should the CSS Styles be included in the JSON (defaults to false).
     * @param       {boolean}   [includeText]                               Should the Text be included in the JSON (defaults to true).
     * @param       {boolean}   [friendlyFormat]                            Should the JSON be returned in an easy-to-read format (defaults to true).
     * 
     * @returns     {Object}                                                The HTML JSON.
     */
    this.get = function( element, includeAttributes, includeCssStyles, includeText, friendlyFormat ) {
        includeAttributes = isDefinedBoolean( includeAttributes ) ? includeAttributes : true;
        includeCssStyles = isDefinedBoolean( includeCssStyles ) ? includeCssStyles : false;
        includeText = isDefinedBoolean( includeText ) ? includeText : true;
        friendlyFormat = isDefinedBoolean( friendlyFormat ) ? friendlyFormat : true;
        
        return getJSON( element, includeAttributes, includeCssStyles, includeText, friendlyFormat );
    };

    /**
     * write().
     * 
     * Converts JSON to HTML and adds it to a parent node.
     * 
     * @public
     * 
     * @param       {Object}    parentElement                               The DOM element to add the new JSON HTML nodes to.
     * @param       {string}    json                                        The JSON that should be converted to HTML.
     * 
     * @returns     {Object}                                                The JHson.js class instance.
     */
    this.write = function( parentElement, json ) {
        return write( parentElement, json );
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
    this.setConfiguration = function( newOptions ) {
        _configuration = !isDefinedObject( newOptions ) ? {} : newOptions;
        
        buildDefaultConfiguration();

        return this;
    };

    function buildDefaultConfiguration() {
        _configuration.nodeTypesToIgnore = getDefaultStringOrArray( _configuration.nodeTypesToIgnore, [ "script" ] );
        _configuration.cssPropertiesToIgnore = getDefaultStringOrArray( _configuration.cssPropertiesToIgnore, [] );
        _configuration.jsonIndentationSpaces = getDefaultNumber( _configuration.jsonIndentationSpaces, 2 );
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
        return "0.1.0";
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