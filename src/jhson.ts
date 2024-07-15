/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        jhson.ts
 * @version     v2.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { PublicApi, PublicApiHtml, PublicApiJson } from "./ts/api";
import { Constants } from "./ts/constant"
import { Data } from "./ts/data";
import { DomElement } from "./ts/dom";
import { Char, JsonValue, Value } from "./ts/enum";
import { Is } from "./ts/is";
import { type Configuration } from "./ts/type";


type StringToJson = {
    parsed: boolean;
    object: any;
};

type WritingScope = {
    css: Record<string, string[]>,
    templateDataKeys: string[],
    templateDataKeysLength: number,
    templateDataKeysProcessed: string[]
};

type HtmlProperties = {
    json: string;
    templateData: Record<string, string>;
    removeOriginalAttributes: boolean;
    clearOriginalHTML: boolean;
    addCssToHead: boolean;
    clearCssFromHead: boolean;
    logTemplateDataWarnings: boolean;
    addAttributes: boolean;
    addCssProperties: boolean;
    addText: boolean;
    addChildren: boolean;
};

type JsonProperties = {
    includeAttributes: boolean,
    includeCssProperties: boolean,
    includeText: boolean,
    includeChildren: boolean,
    friendlyFormat: boolean,
    indentSpaces: number,
    ignoreNodeTypes: string[],
    ignoreCssProperties: string[],
    ignoreAttributes: string[],
    generateUniqueMissingIds: boolean
};

type ElementObject = {
    nodeName: string;
    nodeValues: any;
}


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;
    
    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * JSON - Get
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getDefaultJsonProperties() : JsonProperties {
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
        } as JsonProperties;
    }

    function getJSON( element: HTMLElement, properties: JsonProperties ) : string {
        let result: string = Char.empty;

        if ( Is.definedObject( element ) ) {
            const resultJson: any = {};
            const elementJson: ElementObject = getElementObject( element, properties, {} );

            resultJson[ elementJson.nodeName ] = elementJson.nodeValues;

            if ( properties.friendlyFormat ) {
                result = JSON.stringify( resultJson, null, properties.indentSpaces );
            } else {
                result = JSON.stringify( resultJson );
            }
        }
        
        return result;
    }

    function getElementObject( element: HTMLElement, properties: JsonProperties, parentCssStyles: Record<string, string> ) : ElementObject {
        const result: any = {};
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

        if ( Is.defined( result[ JsonValue.children ] ) && result[ JsonValue.children ].length === 0 ) {
            delete result[ JsonValue.children ];
        }

        return {
            nodeName: element.nodeName.toLowerCase(),
            nodeValues: result
        } as ElementObject;
    }

    function getElementAttributes( element: HTMLElement, result: any, properties: JsonProperties ) : void {
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
                result[ JsonValue.attribute + attribute.nodeName ] = attribute.nodeValue;
                attributesAvailable.push( attribute.nodeName );
            }
        }

        if ( properties.generateUniqueMissingIds && attributesAvailable.indexOf( "id" ) === Value.notFound && properties.ignoreAttributes.indexOf( "id" ) === Value.notFound) {
            result[ JsonValue.attribute + "id" ] = Data.String.newGuid();
        }
    }

    function getElementCssProperties( element: HTMLElement, result: any, properties: JsonProperties, parentCssStyles: Record<string, string> ) : void {
        const computedStyles: CSSStyleDeclaration = getComputedStyle( element );
        const computedStylesLength: number = computedStyles.length;

        for ( let cssComputedStyleIndex: number = 0; cssComputedStyleIndex < computedStylesLength; cssComputedStyleIndex++ ) {
            const cssComputedStyleName: string = computedStyles[ cssComputedStyleIndex ];

            if ( properties.ignoreCssProperties.indexOf( cssComputedStyleName ) === Value.notFound ) {
                const cssComputedStyleNameStorage: string = JsonValue.cssStyle + cssComputedStyleName;
                const cssComputedValue: string = computedStyles.getPropertyValue( cssComputedStyleName );

                if ( !parentCssStyles.hasOwnProperty( cssComputedStyleNameStorage ) || parentCssStyles[ cssComputedStyleNameStorage ] !== cssComputedValue ) {
                    result[ cssComputedStyleNameStorage ] = cssComputedValue;
                    parentCssStyles[ cssComputedStyleNameStorage ] = result[ cssComputedStyleNameStorage ];
                }
            }
        }
    }

    function getElementChildren( element: HTMLElement, result: any, childrenLength: number, properties: JsonProperties, parentCssStyles: Record<string, string> ) : number {
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
                    addChild = true;
                    totalChildren++;
                }
            }

            if ( addChild ) {
                const childJson: Record<string, string> = {} as Record<string, string>;
                childJson[ childElementData.nodeName ] = childElementData.nodeValues;

                result[ JsonValue.children ].push( childJson );
            }
        }

        return totalChildren;
    }

    function getElementText( element: HTMLElement, result: any, childrenAdded: number ) : void {
        if ( Is.definedString( element.innerText ) ) {
            if ( childrenAdded > 0 && Is.defined( result[ JsonValue.children ] ) && result[ JsonValue.children ].length === 0 ) {
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
            clearOriginalHTML: true,
            addCssToHead: false,
            clearCssFromHead: false,
            logTemplateDataWarnings: false,
            addAttributes: true,
            addCssProperties: true,
            addText: true,
            addChildren: true
        } as HtmlProperties;
    }

    function writeHtml( element: HTMLElement, properties: HtmlProperties ) : PublicApi {
        if ( Is.definedObject( element ) && Is.definedString( properties.json ) ) {
            const convertedJsonObject: StringToJson = getObjectFromString( properties.json );
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
                        if ( properties.removeOriginalAttributes ) {
                            while ( element.attributes.length > 0 ) {
                                element.removeAttribute( element.attributes[ 0 ].name );
                            }
                        }

                        if ( properties.clearOriginalHTML ) {
                            element.innerHTML = Char.empty;
                        }

                        writeNode( element, convertedJsonObject.object[ key ], properties, writingScope );
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

    function writeNode( element: HTMLElement, jsonObject: any, properties: HtmlProperties, writingScope: WritingScope ) : void {
        const cssStyles: string[] = [];

        for ( let jsonKey in jsonObject ) {
            if ( Data.String.startsWithAnyCase( jsonKey, JsonValue.attribute ) ) {
                if ( properties.addAttributes ) {
                    const attributeName: string = jsonKey.replace( JsonValue.attribute, Char.empty );
                    const attributeValue: string = jsonObject[ jsonKey ];

                    element.setAttribute( attributeName, attributeValue );
                }

            } else if ( Data.String.startsWithAnyCase( jsonKey, JsonValue.cssStyle ) ) {
                if ( properties.addCssProperties ) {
                    const cssStyleName: string = jsonKey.replace( JsonValue.cssStyle, Char.empty );

                    if ( !properties.addCssToHead ) {
                        element.style.setProperty( cssStyleName, jsonObject[ jsonKey ] );
                    } else {
                        cssStyles.push( cssStyleName + ":" + jsonObject[ jsonKey ] + ";" );
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

    function writeElementTextAndTemplateData( element: HTMLElement, value: string, properties: HtmlProperties, writingScope: WritingScope ) : void {
        element.innerHTML = value;

        if ( writingScope.templateDataKeysLength > 0 ) {
            for ( let templateDataKeyIndex: number = 0; templateDataKeyIndex <  writingScope.templateDataKeysLength; templateDataKeyIndex++ ) {
                let templateDataKey: string = writingScope.templateDataKeys[ templateDataKeyIndex ];

                if ( properties.templateData.hasOwnProperty( templateDataKey ) ) {
                    const templateDataKeyReplacement: string = properties.templateData[ templateDataKey ];

                    if ( element.innerHTML.indexOf( templateDataKey ) > Value.notFound ) {
                        element.innerHTML = Data.String.replaceAll( element.innerHTML, templateDataKey, templateDataKeyReplacement );

                        if ( writingScope.templateDataKeysProcessed.indexOf( templateDataKey ) === Value.notFound ) {
                            writingScope.templateDataKeysProcessed.push( templateDataKey );
                        }

                    } else {
                        templateDataKey = templateDataKey.replace( Char.variableEnd, Char.empty ) + Char.space + Char.variableDefault;

                        const startIndex: number = element.innerHTML.indexOf( templateDataKey );

                        if ( startIndex > Value.notFound ) {
                            const endIndex: number = element.innerHTML.indexOf( Char.variableEnd, startIndex );

                            if ( endIndex > Value.notFound ) {
                                
                                const variable: string = element.innerHTML.substring( startIndex, endIndex + Char.variableEnd.length );
                                
                                element.innerHTML = Data.String.replaceAll( element.innerHTML, variable, templateDataKeyReplacement );
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

            identifier = element.nodeName.toLowerCase() + "." + classNameParts[ 0 ] + " {";
        } else {

            if ( !Is.definedString( element.id ) ) {
                element.id = Data.String.newGuid();
            }

            identifier = "#" + element.id + " {";
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
        const remainingVariables: string[] = Data.String.getTemplateVariables( element.innerHTML );
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
     * Triggering Custom Events
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function fireCustomTriggerEvent( triggerFunction: Function, ...args : any[] ) : void {
        if ( Is.definedFunction( triggerFunction ) ) {
            triggerFunction.apply( null, [].slice.call( args, 0 ) );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Default Parameter/Option Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getObjectFromString( objectString: any ) : StringToJson {
        const result: StringToJson = {
            parsed: true,
            object: null
        } as StringToJson;

        try {
            if ( Is.definedString( objectString ) ) {
                result.object = JSON.parse( objectString );
            }

        } catch ( e1: any ) {
            try {
                result.object = eval( `(${objectString})` );

                if ( Is.definedFunction( result.object ) ) {
                    result.object = result.object();
                }
                
            } catch ( e2: any ) {
                if ( !_configuration.safeMode ) {
                    console.error( _configuration.text!.objectErrorText!.replace( "{{error_1}}",  e1.message ).replace( "{{error_2}}",  e2.message ) );
                    result.parsed = false;
                }
                
                result.object = null;
            }
        }

        return result;
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
            const scope: PublicApiJson = {
                includeAttributes: function ( flag: boolean ) : PublicApiJson {
                    throw new Error("Function not implemented.");
                },

                includeCssProperties: function ( flag: boolean ) : PublicApiJson {
                    throw new Error("Function not implemented.");
                },

                includeText: function ( flag: boolean ) : PublicApiJson {
                    throw new Error("Function not implemented.");
                },

                includeChildren: function ( flag: boolean ) : PublicApiJson {
                    throw new Error("Function not implemented.");
                },

                friendlyFormat: function ( flag: boolean ) : PublicApiJson {
                    throw new Error("Function not implemented.");
                },

                indentSpaces: function ( spaces: number ) : PublicApiJson {
                    throw new Error("Function not implemented.");
                },

                ignoreNodeTypes: function ( types: string[] | string ) : PublicApiJson {
                    throw new Error("Function not implemented.");
                },

                ignoreCssProperties: function ( cssProperties: string[] | string ) : PublicApiJson {
                    throw new Error("Function not implemented.");
                },

                ignoreAttributes: function ( attributes: string[] | string ) : PublicApiJson {
                    throw new Error("Function not implemented.");
                },

                generateUniqueMissingIds: function ( flag: boolean ) : PublicApiJson {
                    throw new Error("Function not implemented.");
                },

                get: function ( element: HTMLElement ) : string {
                    throw new Error("Function not implemented.");
                },

                getVariables: function ( json: string ) : string[] {
                    throw new Error("Function not implemented.");
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
            const scope: PublicApiHtml = {
                json: function ( json: string ) : PublicApiHtml {
                    throw new Error("Function not implemented.");
                },

                templateData: function ( templateData: Record<string, string> ) : PublicApiHtml {
                    throw new Error("Function not implemented.");
                },

                removeOriginalAttributes: function ( flag: boolean ) : PublicApiHtml {
                    throw new Error("Function not implemented.");
                },

                clearOriginalHTML: function ( flag: boolean ) : PublicApiHtml {
                    throw new Error("Function not implemented.");
                },

                addCssToHead: function ( flag: boolean ) : PublicApiHtml {
                    throw new Error("Function not implemented.");
                },

                clearCssFromHead: function ( flag: boolean ) : PublicApiHtml {
                    throw new Error("Function not implemented.");
                },

                logTemplateDataWarnings: function ( flag: boolean ) : PublicApiHtml {
                    throw new Error("Function not implemented.");
                },

                addAttributes: function ( flag: boolean ) : PublicApiHtml {
                    throw new Error("Function not implemented.");
                },

                addCssProperties: function ( flag: boolean ) : PublicApiHtml {
                    throw new Error("Function not implemented.");
                },

                addText: function ( flag: boolean ) : PublicApiHtml {
                    throw new Error("Function not implemented.");
                },

                addChildren: function ( flag: boolean ) : PublicApiHtml {
                    throw new Error("Function not implemented.");
                },

                write: function ( element: HTMLElement ) : PublicApi {
                    throw new Error("Function not implemented.");
                },

                getVariables: function ( element: HTMLElement ) : string[] {
                    throw new Error("Function not implemented.");
                }
            };

            return scope;
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Configuration
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        setConfiguration: function ( newConfiguration: any ): PublicApi {
            throw new Error("Function not implemented.");
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Additional Data
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        getVersion: function (): string {
            throw new Error("Function not implemented.");
        }
    };

    
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize JHson.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( () => {
    
    } )();
} )();