/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        jhson.ts
 * @version     v2.2.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    type StringToJson,
    type BindingOptions,
    type Configuration, 
    type HtmlProperties, 
    type JsonPropertyReplacer, 
    type IgnoreNodeCondition } from "./ts/type";

import {
    type PublicApi,
    type PublicApiHtml,
    type PublicApiJson } from "./ts/api";
    
import { Constant } from "./ts/constant"
import { Default } from "./ts/data/default";
import { DomElement } from "./ts/dom/dom";
import { Char, JsonValue, Value } from "./ts/data/enum";
import { Is } from "./ts/data/is";
import { Str } from "./ts/data/str";
import { Config } from "./ts/options/config";
import { Binding } from "./ts/options/binding";
import { Trigger } from "./ts/area/trigger";


type WritingScope = {
    css: Record<string, string[]>;
    templateDataKeys: string[];
    templateDataKeysLength: number;
    templateDataKeysProcessed: string[];
};

type JsonProperties = {
    includeAttributes: boolean;
    includeDataAttributes: boolean;
    includeCssProperties: boolean;
    includeText: boolean;
    includeChildren: boolean;
    friendlyFormat: boolean;
    indentSpaces: number;
    ignoreNodeTypes: string[];
    ignoreNodeCondition: IgnoreNodeCondition;
    ignoreCssProperties: string[];
    ignoreAttributes: string[];
    generateUniqueMissingIds: boolean;
    generateUniqueMissingNames: boolean;
    propertyReplacer: JsonPropertyReplacer;
};

type ElementObject = {
    nodeName: string;
    nodeValues: Record<string, any>;
};


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;
    

    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Rendering
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function render() : void {
        const tagTypes: string[] = _configuration.domElementTypes as string[];
        const tagTypesLength: number = tagTypes.length;

        for ( let tagTypeIndex: number = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++ ) {
            const domElements: HTMLCollectionOf<Element> = document.getElementsByTagName( tagTypes[ tagTypeIndex ] );
            const elements: HTMLElement[] = [].slice.call( domElements );
            const elementsLength: number = elements.length;

            for ( let elementIndex: number = 0; elementIndex < elementsLength; elementIndex++ ) {
                if ( !renderBindingElement( elements[ elementIndex ] ) ) {
                    break;
                }
            }
        }
    }

    function renderBindingElement( element: HTMLElement ) : boolean {
        let result: boolean = true;

        if ( Is.defined( element ) && element.hasAttribute( Constant.JHSON_JS_ATTRIBUTE_NAME ) ) {
            let bindingOptionsData: string = element.getAttribute( Constant.JHSON_JS_ATTRIBUTE_NAME )!;

            if ( Is.definedString( bindingOptionsData ) ) {
                const bindingOptions: StringToJson = Default.getObjectFromString( bindingOptionsData, _configuration );

                if ( bindingOptions.parsed && Is.definedObject( bindingOptions.object ) ) {
                    renderElement( Binding.Options.getForNewInstance( bindingOptions.object, element, getDefaultHtmlProperties() ) );

                } else {
                    if ( !_configuration.safeMode ) {
                        console.error( _configuration.text!.attributeNotValidErrorText!.replace( "{{attribute_name}}", Constant.JHSON_JS_ATTRIBUTE_NAME ) );
                        result = false;
                    }
                }

            } else {
                if ( !_configuration.safeMode ) {
                    console.error( _configuration.text!.attributeNotSetErrorText!.replace( "{{attribute_name}}", Constant.JHSON_JS_ATTRIBUTE_NAME ) );
                    result = false;
                }
            }
        }

        return result;
    }

    function renderElement( bindingOptions: BindingOptions ) : void {
        Trigger.customEvent( bindingOptions.events!.onBeforeRender!, bindingOptions._currentView.element );

        const properties: HtmlProperties = getDefaultHtmlProperties();
        properties.json = bindingOptions.json!;

        writeHtml( bindingOptions._currentView.element, properties );

        Trigger.customEvent( bindingOptions.events!.onRenderComplete!, bindingOptions._currentView.element );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * JSON - Get
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getDefaultJsonProperties() : JsonProperties {
        return {
            includeAttributes: true,
            includeDataAttributes: true,
            includeCssProperties: false,
            includeText: true,
            includeChildren: true,
            friendlyFormat: true,
            indentSpaces: 2,
            ignoreNodeTypes: [],
            ignoreNodeCondition: null!,
            ignoreCssProperties: [],
            ignoreAttributes: [],
            generateUniqueMissingIds: false,
            generateUniqueMissingNames: false,
            propertyReplacer: null!
        } as JsonProperties;
    }

    function getJSON( element: HTMLElement, properties: JsonProperties ) : string {
        let result: string = Char.empty;

        if ( Is.definedObject( element ) ) {
            const resultJson: any = {};
            const elementJson: ElementObject = getElementObject( element, properties, {} );

            resultJson[ elementJson.nodeName ] = elementJson.nodeValues;

            if ( properties.friendlyFormat ) {
                result = JSON.stringify( resultJson, properties.propertyReplacer, properties.indentSpaces );
            } else {
                result = JSON.stringify( resultJson, properties.propertyReplacer );
            }
        }
        
        return result;
    }

    function getElementObject( element: HTMLElement, properties: JsonProperties, parentCssStyles: Record<string, string> ) : ElementObject {
        const result: Record<string, any> = {};
        const childrenLength: number = element.children.length;
        let childrenAdded: number = 0;

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

        if ( result.hasOwnProperty( JsonValue.children ) && result[ JsonValue.children ].length === 0 ) {
            delete result[ JsonValue.children ];
        }

        return {
            nodeName: element.nodeName.toLowerCase(),
            nodeValues: result
        } as ElementObject;
    }

    function getElementAttributes( element: HTMLElement, result: Record<string, any>, properties: JsonProperties ) : void {
        const attributesLength: number = element.attributes.length;
        const attributesAvailable: string[] = [];

        if ( properties.includeText && element.nodeName.toLowerCase() === "textarea" ) {
            const textArea: HTMLTextAreaElement = element as HTMLTextAreaElement;

            if ( Is.defined( textArea.value ) ) {
                result[ JsonValue.text ] = textArea.value;
            }
        }

        for ( let attributeIndex: number = 0; attributeIndex < attributesLength; attributeIndex++ ) {
            const attribute: Attr = element.attributes[ attributeIndex ];

            if ( Is.definedString( attribute.nodeName ) && properties.ignoreAttributes.indexOf( attribute.nodeName ) === Value.notFound ) {
                if ( properties.includeDataAttributes || !attribute.nodeName.startsWith( Char.dataAttributeStart ) ) {
                    result[ `${JsonValue.attribute}${attribute.nodeName}` ] = attribute.nodeValue;
                    attributesAvailable.push( attribute.nodeName );
                }
            }
        }

        if ( properties.generateUniqueMissingIds && attributesAvailable.indexOf( Char.id ) === Value.notFound && properties.ignoreAttributes.indexOf( Char.id ) === Value.notFound ) {
            result[ `${JsonValue.attribute}${Char.id}` ] = crypto.randomUUID();
        }

        if ( properties.generateUniqueMissingNames && attributesAvailable.indexOf( Char.name ) === Value.notFound && properties.ignoreAttributes.indexOf( Char.name ) === Value.notFound ) {
            result[ `${JsonValue.attribute}${Char.name}` ] = crypto.randomUUID();
        }
    }

    function getElementCssProperties( element: HTMLElement, result: Record<string, any>, properties: JsonProperties, parentCssStyles: Record<string, string> ) : void {
        const computedStyles: CSSStyleDeclaration = getComputedStyle( element );
        const computedStylesLength: number = computedStyles.length;

        for ( let cssComputedStyleIndex: number = 0; cssComputedStyleIndex < computedStylesLength; cssComputedStyleIndex++ ) {
            const cssComputedStyleName: string = computedStyles[ cssComputedStyleIndex ];

            if ( properties.ignoreCssProperties.indexOf( cssComputedStyleName ) === Value.notFound ) {
                const cssComputedStyleNameStorage: string = `${JsonValue.cssStyle}${cssComputedStyleName}`;
                const cssComputedValue: string = computedStyles.getPropertyValue( cssComputedStyleName );

                if ( !parentCssStyles.hasOwnProperty( cssComputedStyleNameStorage ) || parentCssStyles[ cssComputedStyleNameStorage ] !== cssComputedValue ) {
                    result[ cssComputedStyleNameStorage ] = cssComputedValue;
                    parentCssStyles[ cssComputedStyleNameStorage ] = result[ cssComputedStyleNameStorage ];
                }
            }
        }
    }

    function getElementChildren( element: HTMLElement, result: Record<string, any>, childrenLength: number, properties: JsonProperties, parentCssStyles: Record<string, string> ) : number {
        let totalChildren: number = 0;
        
        result[ JsonValue.children ] = [];

        for ( let childrenIndex: number = 0; childrenIndex < childrenLength; childrenIndex++ ) {
            const child: HTMLElement = element.children[ childrenIndex ] as HTMLElement;
            const childElementData: ElementObject = getElementObject( child, properties, getParentCssStylesCopy( parentCssStyles ) );
            let addChild: boolean = false;

            if ( _configuration.formattingNodeTypes.indexOf( childElementData.nodeName ) > Value.notFound ) {
                totalChildren++;
            } else {

                if ( properties.ignoreNodeTypes.indexOf( childElementData.nodeName ) === Value.notFound ) {
                    if ( !Is.definedFunction( properties.ignoreNodeCondition ) || !properties.ignoreNodeCondition( child ) ) {
                        addChild = true;
                        totalChildren++;
                    }
                }
            }

            if ( addChild ) {
                const childJson: Record<string, any> = {} as Record<string, any>;
                childJson[ childElementData.nodeName ] = childElementData.nodeValues;

                result[ JsonValue.children ].push( childJson );
            }
        }

        return totalChildren;
    }

    function getElementText( element: HTMLElement, result: Record<string, any>, childrenAdded: number ) : void {
        if ( Is.definedString( element.innerText ) ) {
            if ( childrenAdded > 0 && result.hasOwnProperty( JsonValue.children ) && result[ JsonValue.children ].length === 0 ) {
                result[ JsonValue.text ] = element.innerHTML;
            } else {
    
                if ( element.innerText.trim() === element.innerHTML.trim() ) {
                    result[ JsonValue.text ] = element.innerText;
                }
            }
        }
    }

    function getParentCssStylesCopy( parentCssStyles: Record<string, string> ) : Record<string, string> {
        const copy: Record<string, string> = {};

        for ( let cssStyleName in parentCssStyles ) {
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

    function getDefaultHtmlProperties() : HtmlProperties {
        return {
            json: Char.empty,
            templateData: {},
            removeOriginalAttributes: true,
            removeOriginalDataAttributes: true,
            clearOriginalHTML: true,
            addCssToHead: false,
            clearCssFromHead: false,
            logTemplateDataWarnings: false,
            addAttributes: true,
            addCssProperties: true,
            addText: true,
            addChildren: true,
            insertBefore: false
        } as HtmlProperties;
    }

    function getHtml( properties: HtmlProperties ) : HTMLElement {
        let result: HTMLElement = null!;

        if ( Is.definedString( properties.json ) ) {
            const convertedJsonObject: StringToJson = Default.getObjectFromString( properties.json, _configuration );

            for ( let key in convertedJsonObject.object ) {
                result = DomElement.createWithNoContainer( key );
                break;
            }

            if ( Is.defined( result ) ) {
                writeHtml( result, properties, convertedJsonObject );
            }
        }

        return result;
    }

    function writeHtml( element: HTMLElement, properties: HtmlProperties, overrideConvertedJsonObject: StringToJson = null! ) : PublicApi {
        if ( Is.definedObject( element ) && Is.definedString( properties.json ) ) {
            let convertedJsonObject: StringToJson = overrideConvertedJsonObject;

            if ( !Is.definedObject( convertedJsonObject ) ) {
                convertedJsonObject = Default.getObjectFromString( properties.json, _configuration )
            }

            const writingScope: WritingScope = {
                css: {},
                templateDataKeys: [],
                templateDataKeysLength: 0,
                templateDataKeysProcessed: []
            } as WritingScope;

            if ( convertedJsonObject.parsed && Is.definedObject( convertedJsonObject.object ) ) {
                if ( properties.clearCssFromHead ) {
                    clearCssStyleTagsFromHead();
                }
    
                if ( Is.definedObject( properties.templateData ) ) {
                    setupWritingScopeTemplateDataKeys( properties, writingScope );
                }

                for ( let key in convertedJsonObject.object ) {
                    if ( key === element.nodeName.toLowerCase() ) {
                        let insertBefore: HTMLElement = null!;

                        if ( properties.removeOriginalAttributes ) {
                            let attributesLength: number = element.attributes.length;

                            while ( attributesLength > 0 ) {
                                const attributeName: string = element.attributes[ 0 ].name;

                                if ( properties.removeOriginalDataAttributes || !attributeName.startsWith( Char.dataAttributeStart ) ) {
                                    element.removeAttribute( attributeName );
                                }

                                attributesLength--;
                            }
                        }

                        if ( properties.clearOriginalHTML ) {
                            element.innerHTML = Char.empty;
                        } else if ( properties.insertBefore && element.children.length > 0 ) {
                            insertBefore = element.children[ 0 ] as HTMLElement;
                        }

                        writeNode( element, convertedJsonObject.object[ key ], properties, writingScope, insertBefore );
                        break;
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

    function setupWritingScopeTemplateDataKeys( properties: HtmlProperties, writingScope: WritingScope ) : void {
        for ( let templateDataKey in properties.templateData ) {
            if ( properties.templateData.hasOwnProperty( templateDataKey ) ) {
                writingScope.templateDataKeys.push( templateDataKey );
            }
        }

        writingScope.templateDataKeys = writingScope.templateDataKeys.sort( function( a, b ) {
            return b.length - a.length;
        } );

        writingScope.templateDataKeysLength = writingScope.templateDataKeys.length;
    }

    function writeNode( element: HTMLElement, jsonObject: any, properties: HtmlProperties, writingScope: WritingScope, insertBefore: HTMLElement ) : void {
        const cssStyles: string[] = [];

        for ( let jsonKey in jsonObject ) {
            if ( Str.startsWithAnyCase( jsonKey, JsonValue.attribute ) ) {
                if ( properties.addAttributes ) {
                    const attributeName: string = jsonKey.replace( JsonValue.attribute, Char.empty );

                    if ( properties.addDataAttributes || !attributeName.startsWith( Char.dataAttributeStart ) ) {
                        const attributeValue: string = jsonObject[ jsonKey ];

                        element.setAttribute( attributeName, attributeValue );
                    }
                }

            } else if ( Str.startsWithAnyCase( jsonKey, JsonValue.cssStyle ) ) {
                if ( properties.addCssProperties ) {
                    const cssStyleName: string = jsonKey.replace( JsonValue.cssStyle, Char.empty );

                    if ( !properties.addCssToHead ) {
                        element.style.setProperty( cssStyleName, jsonObject[ jsonKey ] );
                    } else {
                        cssStyles.push( `${cssStyleName}:${jsonObject[jsonKey]};` );
                    }
                }

            } else if ( jsonKey === JsonValue.text ) {
                if ( properties.addText ) {
                    writeElementTextAndTemplateData( element, jsonObject[ jsonKey ], properties, writingScope );
                }

            } else if ( jsonKey === JsonValue.children ) {
                if ( properties.addChildren ) {
                    const childrenLength: number = jsonObject[ jsonKey ].length;

                    for ( let childrenIndex: number = 0; childrenIndex < childrenLength; childrenIndex++ ) {
                        const childJson: any = jsonObject[ jsonKey ][ childrenIndex ];
    
                        for ( let childJsonKey in childJson ) {
                            if ( childJson.hasOwnProperty( childJsonKey ) ) {
                                const childElement: HTMLElement = DomElement.create( element, childJsonKey.toLowerCase() );
    
                                writeNode( childElement, childJson[ childJsonKey ], properties, writingScope, null! );
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

    function writeElementTextAndTemplateData( element: HTMLElement, value: string, properties: HtmlProperties, writingScope: WritingScope ) : void {
        element.innerHTML = value;

        if ( writingScope.templateDataKeysLength > 0 ) {
            for ( let templateDataKeyIndex: number = 0; templateDataKeyIndex <  writingScope.templateDataKeysLength; templateDataKeyIndex++ ) {
                let templateDataKey: string = writingScope.templateDataKeys[ templateDataKeyIndex ];

                if ( properties.templateData.hasOwnProperty( templateDataKey ) ) {
                    const templateDataKeyReplacement: string = properties.templateData[ templateDataKey ];

                    if ( element.innerHTML.indexOf( templateDataKey ) > Value.notFound ) {
                        element.innerHTML = Str.replaceAll( element.innerHTML, templateDataKey, templateDataKeyReplacement );

                        if ( writingScope.templateDataKeysProcessed.indexOf( templateDataKey ) === Value.notFound ) {
                            writingScope.templateDataKeysProcessed.push( templateDataKey );
                        }

                    } else {
                        templateDataKey = `${templateDataKey.replace( Char.variableEnd, Char.empty )}${Char.space}${Char.variableDefault}`;

                        const startIndex: number = element.innerHTML.indexOf( templateDataKey );

                        if ( startIndex > Value.notFound ) {
                            const endIndex: number = element.innerHTML.indexOf( Char.variableEnd, startIndex );

                            if ( endIndex > Value.notFound ) {
                                const variable: string = element.innerHTML.substring( startIndex, endIndex + Char.variableEnd.length );
                                
                                element.innerHTML = Str.replaceAll( element.innerHTML, variable, templateDataKeyReplacement );
                            }
                        }
                    }
                }
            }
        }
    }

    function storeCssStyles( element: HTMLElement, cssStyles: string[], writingScope: WritingScope ) : void {
        let identifier: string = null!;

        if ( Is.definedString( element.className ) ) {
            const classNameParts: string[] = element.className.split( Char.space );

            identifier = `${element.nodeName.toLowerCase()}.${classNameParts[0]} {`;
        } else {

            if ( !Is.definedString( element.id ) ) {
                element.id = crypto.randomUUID();
            }

            identifier = `#${element.id} {`;
        }

        let cssLines: string[] = [];
        cssLines.push( identifier );
        cssLines = cssLines.concat( cssStyles );
        cssLines.push( "}" );

        writingScope.css[ element.id ] = cssLines;
    }

    function writeCssStyleTag( writingScope: WritingScope ) : void {
        const head: HTMLElement = document.getElementsByTagName( "head" )[ 0 ];
        let cssLines: string[] = [];

        for ( let elementId in writingScope.css ) {
            if ( writingScope.css.hasOwnProperty( elementId ) ) {
                cssLines = cssLines.concat( writingScope.css[ elementId ] );
            }
        }

        const style: HTMLStyleElement = DomElement.create( head, "style" ) as HTMLStyleElement;
        style.appendChild( document.createTextNode( cssLines.join( Char.newLine ) ) );
    }

    function clearCssStyleTagsFromHead() : void {
        const styles: HTMLElement[] = [].slice.call( document.getElementsByTagName( "styles" ) );
        const stylesLength: number = styles.length;

        for ( let styleIndex: number = 0; styleIndex < stylesLength; styleIndex++ ) {
            styles[ styleIndex ].parentNode!.removeChild( styles[ styleIndex ] );
        }
    }

    function checkedForUnusedTemplateData( writingScope: WritingScope ) : void {
        const templateDataKeysProcessedLength: number = writingScope.templateDataKeysProcessed.length;

        if ( writingScope.templateDataKeysLength > templateDataKeysProcessedLength ) {
            for ( let templateDataKeyIndex: number = 0; templateDataKeyIndex < writingScope.templateDataKeysLength; templateDataKeyIndex++ ) {
                const templateDataKey: string = writingScope.templateDataKeys[ templateDataKeyIndex ];

                if ( writingScope.templateDataKeysProcessed.indexOf( templateDataKey ) === Value.notFound ) {
                    console.warn( _configuration.text!.variableWarningText!.replace( "{{variable_name}}", templateDataKey ) );
                }
            }
        }
    }

    function processRemainingVariablesForDefaults( element: HTMLElement ) : void {
        const remainingVariables: string[] = Str.getTemplateVariables( element.innerHTML );
        const remainingVariablesLength: number = remainingVariables.length;
        
        for ( let remainingVariableIndex: number = 0; remainingVariableIndex < remainingVariablesLength; remainingVariableIndex++ ) {
            const variable: string = remainingVariables[ remainingVariableIndex ];

            if ( variable.indexOf( Char.variableDefault ) > Value.notFound ) {
                const defaultValue: string = variable
                    .replace( Char.variableStart, Char.empty )
                    .replace( Char.variableEnd, Char.empty )
                    .split( Char.variableDefault )[ 1 ];

                if ( Is.definedString( defaultValue ) ) {
                    element.innerHTML = element.innerHTML.replace( variable, defaultValue.trim() );
                }
            }
        }
    }


	/*
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 * Public API Functions:
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 */

    const _public: PublicApi = {
        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  JSON
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        json: function () : PublicApiJson {
            const properties: JsonProperties = getDefaultJsonProperties();

            const scope: PublicApiJson = {
                includeAttributes: function ( flag: boolean ) : PublicApiJson {
                    properties.includeAttributes = Default.getBoolean( flag, properties.includeAttributes );

                    return this;
                },

                includeDataAttributes: function ( flag: boolean ) : PublicApiJson {
                    properties.includeDataAttributes = Default.getBoolean( flag, properties.includeDataAttributes );

                    return this;
                },

                includeCssProperties: function ( flag: boolean ) : PublicApiJson {
                    properties.includeCssProperties = Default.getBoolean( flag, properties.includeCssProperties );

                    return this;
                },

                includeText: function ( flag: boolean ) : PublicApiJson {
                    properties.includeText = Default.getBoolean( flag, properties.includeText );

                    return this;
                },

                includeChildren: function ( flag: boolean ) : PublicApiJson {
                    properties.includeChildren = Default.getBoolean( flag, properties.includeChildren );

                    return this;
                },

                friendlyFormat: function ( flag: boolean ) : PublicApiJson {
                    properties.friendlyFormat = Default.getBoolean( flag, properties.friendlyFormat );

                    return this;
                },

                indentSpaces: function ( spaces: number ) : PublicApiJson {
                    properties.indentSpaces = Default.getNumber( spaces, properties.indentSpaces );

                    return this;
                },

                ignoreNodeTypes: function ( types: string[] | string ) : PublicApiJson {
                    properties.ignoreNodeTypes = Default.getStringOrArray( types, properties.ignoreNodeTypes );

                    return this;
                },

                ignoreNodeCondition: function ( func: IgnoreNodeCondition ) : PublicApiJson {
                    properties.ignoreNodeCondition = Default.getFunction( func, properties.ignoreNodeCondition );

                    return this;
                },

                ignoreCssProperties: function ( cssProperties: string[] | string ) : PublicApiJson {
                    properties.ignoreCssProperties = Default.getStringOrArray( cssProperties, properties.ignoreCssProperties );

                    return this;
                },

                ignoreAttributes: function ( attributes: string[] | string ) : PublicApiJson {
                    properties.ignoreAttributes = Default.getStringOrArray( attributes, properties.ignoreAttributes );

                    return this;
                },

                generateUniqueMissingIds: function ( flag: boolean ) : PublicApiJson {
                    properties.generateUniqueMissingIds = Default.getBoolean( flag, properties.generateUniqueMissingIds );

                    return this;
                },

                generateUniqueMissingNames: function ( flag: boolean ) : PublicApiJson {
                    properties.generateUniqueMissingNames = Default.getBoolean( flag, properties.generateUniqueMissingNames );

                    return this;
                },

                propertyReplacer: function ( func: JsonPropertyReplacer ) : PublicApiJson {
                    properties.propertyReplacer = Default.getFunction( func, properties.propertyReplacer );

                    return this;
                },

                get: function ( element: HTMLElement ) : string {
                    return getJSON( element, properties );
                },

                getVariables: function ( json: string ) : string[] {
                    return Str.getTemplateVariables( json );
                }
            };

            return scope;
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  HTML
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        html: function () : PublicApiHtml {
            const properties: HtmlProperties = getDefaultHtmlProperties();

            const scope: PublicApiHtml = {
                json: function ( json: string ) : PublicApiHtml {
                    properties.json = Default.getString( json, properties.json );

                    return scope;
                },

                templateData: function ( templateData: Record<string, string> ) : PublicApiHtml {
                    properties.templateData = Default.getObject( templateData, properties.templateData );

                    return scope;
                },

                removeOriginalAttributes: function ( flag: boolean ) : PublicApiHtml {
                    properties.removeOriginalAttributes = Default.getBoolean( flag, properties.removeOriginalAttributes );

                    return scope;
                },

                removeOriginalDataAttributes: function ( flag: boolean ) : PublicApiHtml {
                    properties.removeOriginalDataAttributes = Default.getBoolean( flag, properties.removeOriginalDataAttributes );

                    return scope;
                },

                clearOriginalHTML: function ( flag: boolean ) : PublicApiHtml {
                    properties.clearOriginalHTML = Default.getBoolean( flag, properties.clearOriginalHTML );

                    return scope;
                },

                addCssToHead: function ( flag: boolean ) : PublicApiHtml {
                    properties.addCssToHead = Default.getBoolean( flag, properties.addCssToHead );

                    return scope;
                },

                clearCssFromHead: function ( flag: boolean ) : PublicApiHtml {
                    properties.clearCssFromHead = Default.getBoolean( flag, properties.clearCssFromHead );

                    return scope;
                },

                logTemplateDataWarnings: function ( flag: boolean ) : PublicApiHtml {
                    properties.logTemplateDataWarnings = Default.getBoolean( flag, properties.logTemplateDataWarnings );

                    return scope;
                },

                addAttributes: function ( flag: boolean ) : PublicApiHtml {
                    properties.addAttributes = Default.getBoolean( flag, properties.addAttributes );

                    return scope;
                },

                addDataAttributes: function ( flag: boolean ) : PublicApiHtml {
                    properties.addDataAttributes = Default.getBoolean( flag, properties.addDataAttributes );

                    return scope;
                },

                addCssProperties: function ( flag: boolean ) : PublicApiHtml {
                    properties.addCssProperties = Default.getBoolean( flag, properties.addCssProperties );

                    return scope;
                },

                addText: function ( flag: boolean ) : PublicApiHtml {
                    properties.addText = Default.getBoolean( flag, properties.addText );

                    return scope;
                },

                addChildren: function ( flag: boolean ) : PublicApiHtml {
                    properties.addChildren = Default.getBoolean( flag, properties.addChildren );

                    return scope;
                },

                insertBefore: function ( flag: boolean ) : PublicApiHtml {
                    properties.insertBefore = Default.getBoolean( flag, properties.insertBefore );

                    return scope;
                },

                write: function ( element: HTMLElement ) : PublicApi {
                    return writeHtml( element, properties );
                },

                get: function () : HTMLElement {
                    return getHtml( properties );
                },

                getVariables: function ( element: HTMLElement ) : string[] {
                    let result: string[] = [];

                    if ( Is.definedObject( element ) ) {
                        result = Str.getTemplateVariables( element.innerHTML );
                    }
                    
                    return result;
                }
            };

            return scope;
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Configuration
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        setConfiguration: function ( newConfiguration: any ) : PublicApi {
            if ( Is.definedObject( newConfiguration ) ) {
                let configurationHasChanged: boolean = false;
                const newInternalConfiguration: any = _configuration;
            
                for ( let propertyName in newConfiguration ) {
                    if ( newConfiguration.hasOwnProperty( propertyName ) && _configuration.hasOwnProperty( propertyName ) && newInternalConfiguration[ propertyName ] !== newConfiguration[ propertyName ] ) {
                        newInternalConfiguration[ propertyName ] = newConfiguration[ propertyName ];
                        configurationHasChanged = true;
                    }
                }
        
                if ( configurationHasChanged ) {
                    _configuration = Config.Options.get( newInternalConfiguration );
                }
            }
    
            return _public;
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Additional Data
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        getVersion: function () : string {
            return "2.2.0";
        }
    };

    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize JHson.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( () => {
        _configuration = Config.Options.get();

        document.addEventListener( "DOMContentLoaded", () => render() );

        if ( !Is.defined( window.$jhson ) ) {
            window.$jhson = _public;
        }
    } )();
} )();