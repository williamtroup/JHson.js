var _BODY = null;

var _JSON_TEXTAREA = null,
    _INCLUDE_ATTRIBUTES = null,
    _INCLUDE_CSS_STYLES = null,
    _INCLUDE_TEXT = null,
    _INCLUDE_CHILDREN = null,
    _FRIENDLY_FORMAT = null,
    _INDENT_SPACES = null,
    _IGNORE_NODE_TYPES = null,
    _IGNORE_CSS_PROPERTIES = null,
    _IGNORE_ATTRIBUTES = null,
    _GENERATE_UNIQUE_MISSING_IDS = null,
    _GENERATE_UNIQUE_MISSING_NAMES = null;

var _SET_TEMPLATE_DATA = null,
    _REMOVE_ATTRIBUTES = null,
    _CLEAR_HTML = null,
    _WRITE_CSS_TO_HEAD = null,
    _CLEAR_CSS_FROM_HEAD = null,
    _LOG_TEMPLATE_DATA_WARNINGS = null,
    _ADD_ATTRIBUTES = null,
    _ADD_CSS_PROPERTIES = null,
    _ADD_TEXT = null,
    _ADD_CHILDREN = null,
    _INSERT_BEFORE = null;

( function() {
    document.addEventListener( "DOMContentLoaded", function() {
        document.title += " - v" + $jhson.getVersion();
        document.getElementById( "header" ).innerText += " - v" + $jhson.getVersion();

        _BODY = document.getElementsByTagName( "body" )[ 0 ];

        _JSON_TEXTAREA = document.getElementById( "json" );
        _INCLUDE_ATTRIBUTES = document.getElementById( "includeAttributes" );
        _INCLUDE_CSS_STYLES = document.getElementById( "includeCssProperties" );
        _INCLUDE_TEXT = document.getElementById( "includeText" );
        _INCLUDE_CHILDREN = document.getElementById( "includeChildren" );
        _FRIENDLY_FORMAT = document.getElementById( "friendlyFormat" );
        _INDENT_SPACES = document.getElementById( "indentSpaces" );
        _IGNORE_NODE_TYPES = document.getElementById( "ignoreNodeTypes" );
        _IGNORE_CSS_PROPERTIES = document.getElementById( "ignoreCssProperties" );
        _IGNORE_ATTRIBUTES = document.getElementById( "ignoreAttributes" );
        _GENERATE_UNIQUE_MISSING_IDS = document.getElementById( "generateUniqueMissingIds" );
        _GENERATE_UNIQUE_MISSING_NAMES = document.getElementById( "generateUniqueMissingNames" );

        _SET_TEMPLATE_DATA = document.getElementById( "setTemplateData" );
        _REMOVE_ATTRIBUTES = document.getElementById( "removeOriginalAttributes" );
        _CLEAR_HTML = document.getElementById( "clearOriginalHTML" );
        _WRITE_CSS_TO_HEAD = document.getElementById( "addCssToHead" );
        _CLEAR_CSS_FROM_HEAD = document.getElementById( "clearCssFromHead" );
        _LOG_TEMPLATE_DATA_WARNINGS = document.getElementById( "logTemplateDataWarnings" );
        _ADD_ATTRIBUTES = document.getElementById( "addAttributes" );
        _ADD_CSS_PROPERTIES = document.getElementById( "addCssProperties" );
        _ADD_TEXT = document.getElementById( "addText" );
        _ADD_CHILDREN = document.getElementById( "addChildren" );
        _INSERT_BEFORE = document.getElementById( "insertBefore" );
    } );
} )();

function setupConfiguration() {
    $jhson.setConfiguration( {
        safeMode: false
    } );
}

function getJSONData() {
    _JSON_TEXTAREA.value = $jhson
        .json()
        .includeAttributes( _INCLUDE_ATTRIBUTES.checked )
        .includeCssProperties( _INCLUDE_CSS_STYLES.checked )
        .includeText( _INCLUDE_TEXT.checked )
        .includeChildren( _INCLUDE_CHILDREN.checked )
        .friendlyFormat( _FRIENDLY_FORMAT.checked )
        .indentSpaces( parseInt( _INDENT_SPACES.value ) )
        .ignoreNodeTypes( _IGNORE_NODE_TYPES.value )
        .ignoreCssProperties( _IGNORE_CSS_PROPERTIES.value )
        .ignoreAttributes( _IGNORE_ATTRIBUTES.value )
        .generateUniqueMissingIds( _GENERATE_UNIQUE_MISSING_IDS.checked )
        .generateUniqueMissingNames( _GENERATE_UNIQUE_MISSING_NAMES.checked )
        .get( _BODY );
}

function getJSONVariables() {
    var variables = $jhson.json().getVariables( "{{variable_start}}<div>{{variable_1}}</div><div>{{variable_2}}</div>{{variable_end}}" ),
        variablesString = JSON.stringify( variables );

    console.log( variablesString );
}

function getHTMLVariables() {
    var variables = $jhson.html().getVariables( document.getElementById( "description" ) ),
        variablesString = JSON.stringify( variables );

    console.log( variablesString );
}

function writeJSONData() {
    var htmlScope = $jhson
        .html()
        .json( _JSON_TEXTAREA.value );

    if ( _SET_TEMPLATE_DATA.checked ) {
        htmlScope = htmlScope.templateData( { 
            "{{template_data}}": "this template data",
            "{{template_data_not_available}}": "more template data",
            "{{template_bootstrap}}": "bootstrap"
        } );
    }

    htmlScope
        .removeOriginalAttributes( _REMOVE_ATTRIBUTES.checked )
        .clearOriginalHTML( _CLEAR_HTML.checked )
        .addCssToHead( _WRITE_CSS_TO_HEAD.checked )
        .clearCssFromHead( _CLEAR_CSS_FROM_HEAD.checked )
        .logTemplateDataWarnings( _LOG_TEMPLATE_DATA_WARNINGS.checked )
        .addAttributes( _ADD_ATTRIBUTES.checked )
        .addCssProperties( _ADD_CSS_PROPERTIES.checked )
        .addText( _ADD_TEXT.checked )
        .addChildren( _ADD_CHILDREN.checked )
        .insertBefore( _INSERT_BEFORE.checked )
        .write( _BODY );
}