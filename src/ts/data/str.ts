/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        str.ts
 * @version     v2.2.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Char, Value } from "./enum";
import { Is } from "./is";


export namespace Str {
    export function startsWithAnyCase( data: string, start: string ) : boolean {
        return data.substring( 0, start.length ).toLowerCase() === start.toLowerCase();
    }

    export function replaceAll( string: string, find: string, replace: string ) : string {
        return string.replace( new RegExp( find.replace( Char.variableDefault, `[${Char.variableDefault}]` ), "g" ), replace );
    }

    export function getTemplateVariables( data: string ) : string[] {
        const result: string[] = [];

        if ( Is.definedString( data ) ) {
            let startIndex: number = 0;
            let endIndex: number = 0;

            while ( startIndex > Value.notFound ) {
                startIndex = data.indexOf( Char.variableStart, endIndex );

                if ( startIndex > Value.notFound ) {
                    endIndex = data.indexOf( Char.variableEnd, startIndex );

                    if ( endIndex > Value.notFound ) {
                        const variable: string = data.substring( startIndex, endIndex + Char.variableEnd.length );

                        result.push( variable );

                        endIndex += 2;
                    }
                }
            }
        }

        return result;
    }
}