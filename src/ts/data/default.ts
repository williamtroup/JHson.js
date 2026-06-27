/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        default.ts
 * @version     v2.4.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2026
 */


import { type ConfigurationOptions, type StringToJson } from "../type";
import { Char } from "./enum";
import { Is } from "./is";


export namespace Default {
    export function getString( value: any, defaultValue: string ) : string {
        return Is.definedString( value ) ? value : defaultValue;
    }

    export function getBoolean( value: any, defaultValue: boolean ) : boolean {
        return Is.definedBoolean( value ) ? value : defaultValue;
    }

    export function getNumber( value: any, defaultValue: number ) : number {
        return Is.definedNumber( value ) ? value : defaultValue;
    }

    export function getFunction( value: any, defaultValue: object ) : any {
        return Is.definedFunction( value ) ? value : defaultValue;
    }

    export function getArray( value: any, defaultValue: any[] ) : any[] {
        return Is.definedArray( value ) ? value : defaultValue;
    }

    export function getObject( value: any, defaultValue: object ) : any {
        return Is.definedObject( value ) ? value : defaultValue;
    }

    export function getStringOrArray( value: any, defaultValue: string[] ) : string[] {
        let result: string[] = defaultValue;

        if ( Is.definedString( value ) ) {
            const values: string[] = value.toString().split( Char.space );

            if ( values.length > 0 ) {
                result = values;
            }

        } else {
            result = getArray( value, defaultValue );
        }

        return result;
    }

    export function getObjectFromString( objectString: any, configuration: ConfigurationOptions ) : StringToJson {
        const result: StringToJson = {
            parsed: true,
            object: null
        } as StringToJson;

        try {
            if ( Is.definedString( objectString ) ) {
                try {
                    result.object = JSON.parse( objectString );
                } catch {
                    result.object = JSON.parse( objectString.replace( /'/g, '"' ) );
                }
            }

        } catch ( e1: any ) {
            try {
                result.object = getObjectFromFunction( objectString );
                
            } catch ( e2: any ) {
                if ( !configuration.safeMode ) {
                    console.error( configuration.text!.objectErrorText!.replace( "{{error_1}}",  e1.message ).replace( "{{error_2}}",  e2.message ) );
                    result.parsed = false;
                }
                
                result.object = null;
            }
        }

        return result;
    }

    function getObjectFromFunction( functionName: string ) : any {
        let result: any = null;

        const functionNameParts: string[] = functionName.split( "(" );
        let functionNameArguments: string[] = [];

        if ( functionNameParts.length > 1 ) {
            functionNameArguments = functionNameParts[ 1 ]
                .replace( ")", Char.empty )
                .replace( ";", Char.empty )
                .trim()
                .split( Char.comma );

            if ( functionNameArguments.length === 1 && functionNameArguments[ 0 ] === Char.empty ) {
                functionNameArguments = [];
            }
        }

        const namespaces: string[] = functionNameParts[ 0 ].split( Char.dot );
        const onlyFunctionName: string = namespaces.pop()!;
        let context: any = globalThis;
        let contextFound: boolean = true;

        for ( const namespace of namespaces ) {
            context = context[ namespace ];
            
            if ( !Is.defined( context ) ) {
                contextFound = false;
                break;
            }
        }

        if ( contextFound && Is.definedFunction( context[ onlyFunctionName ] ) ) {
            result = context[ onlyFunctionName ].apply( context, functionNameArguments );
        }

        return result;
    }
}