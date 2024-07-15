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
import { Is } from "./ts/is";
import { type Configuration } from "./ts/type";


type StringToJson = {
    parsed: boolean;
    object: any;
};


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;
    
    
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