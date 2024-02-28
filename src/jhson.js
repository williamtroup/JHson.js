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
    var // Variables: Constructor Parameters
        _parameter_Document = null,
        _parameter_Window = null,
        _parameter_Math = null,
        _parameter_JSON = null,

        // Variables: Configuration
        _configuration = {},

        // Variables: Strings
        _string = {
            empty: "",
            space: " "
        };



    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * JSON - Write
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getJSON( element, includeAttributes, includeCssStyles ) {
        includeAttributes = isDefinedBoolean( includeAttributes ) ? includeAttributes : true;
        includeCssStyles = isDefinedBoolean( includeCssStyles ) ? includeCssStyles : false;

        var result = _string.empty,
            resultJson = {},
            elementJson = getElementObject( element, includeAttributes, includeCssStyles );

        resultJson[ elementJson.nodeName ] = elementJson.nodeValues;
        result = _parameter_JSON.stringify( resultJson );

        return result;
    }

    function getElementObject( element, includeAttributes, includeCssStyles ) {
        var result = {},
            childrenLength = element.children.length;

        if ( includeAttributes ) {
            getElementAttributes( element, result );
        }

        if ( includeCssStyles ) {
            getElementCssStyles( element, result );
        }

        if ( childrenLength > 0 ) {
            getElementChildren( childrenLength, element, result, includeAttributes, includeCssStyles );
        }

        if ( element.innerText === element.innerHTML ) {
            result[ "#text" ] = element.innerText;
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

    function getElementCssStyles( element, result ) {
        if ( _parameter_Window.getComputedStyle ) {
            var cssComputedStyles = _parameter_Document.defaultView.getComputedStyle( element ),
                cssComputedStylesLength = cssComputedStyles.length;

            for ( var cssComputedStyleIndex = 0; cssComputedStyleIndex < cssComputedStylesLength; cssComputedStyleIndex++ ) {
                var cssComputedStyleName = cssComputedStyles[ cssComputedStyleIndex ];
    
                result[ "$" + cssComputedStyleName ] = cssComputedStyles.getPropertyValue( cssComputedStyleName );
            }

        } else if ( element.currentStyle ) {
            for ( var cssStyleName in element.currentStyle ) {
                if ( element.currentStyle.hasOwnProperty( cssStyleName ) ) {
                    result[ "$" + cssStyleName ] = element.currentStyle[ cssStyleName ];
                }
            }
        }
    }

    function getElementChildren( childrenLength, element, result, includeAttributes, includeCssStyles ) {
        result.children = [];

        for ( var childrenIndex = 0; childrenIndex < childrenLength; childrenIndex++ ) {
            var child = element.children[ childrenIndex ],
                childElementData = getElementObject( child, includeAttributes, includeCssStyles );

            if ( _configuration.nodeTypesToIgnore.indexOf( childElementData.nodeName ) === -1 ) {
                var childJson = {};
                childJson[ childElementData.nodeName ] = childElementData.nodeValues;

                result.children.push( childJson );
            }
        }
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
     * @param       {boolean}   [includeAttributes]                         Should the Attributes be included in the JSON.
     * @param       {boolean}   [includeCssStyles]                          Should the CSS Styles be included in the JSON.
     * 
     * @returns     {Object}                                                The HTML JSON.
     */
    this.get = function( element, includeAttributes, includeCssStyles ) {
        return getJSON( element, includeAttributes, includeCssStyles );
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

    ( function ( documentObject, windowObject, mathObject, jsonObject ) {
        _parameter_Document = documentObject;
        _parameter_Window = windowObject;
        _parameter_Math = mathObject;
        _parameter_JSON = jsonObject;

        buildDefaultConfiguration();

        _parameter_Document.addEventListener( "DOMContentLoaded", function() {
            render();
        } );

        if ( !isDefined( _parameter_Window.$jhson ) ) {
            _parameter_Window.$jhson = this;
        }

    } ) ( document, window, Math, JSON );
} )();