/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        default.js
 * @version     v2.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Char, Value } from "./enum";
import { Is } from "./is";


export namespace Default {
    export function getDefaultAnyString( value: any, defaultValue: string ) : string {
        return typeof value === "string" ? value : defaultValue;
    }

    export function getDefaultString( value: any, defaultValue: string ) : string {
        return Is.definedString( value ) ? value : defaultValue;
    }

    export function getDefaultBoolean( value: any, defaultValue: boolean ) : boolean {
        return Is.definedBoolean( value ) ? value : defaultValue;
    }

    export function getDefaultNumber( value: any, defaultValue: number ) : number {
        return Is.definedNumber( value ) ? value : defaultValue;
    }

    export function getDefaultFunction( value: any, defaultValue: object ) : any {
        return Is.definedFunction( value ) ? value : defaultValue;
    }

    export function getDefaultArray( value: any, defaultValue: any[] ) : any[] {
        return Is.definedArray( value ) ? value : defaultValue;
    }

    export function getDefaultObject( value: any, defaultValue: object ) : any {
        return Is.definedObject( value ) ? value : defaultValue;
    }

    export function getDefaultStringOrArray( value: any, defaultValue: string[] ) : string[] {
        let result: string[] = defaultValue;

        if ( Is.definedString( value ) ) {
            const values: string[] = value.toString().split( Char.space );

            if ( values.length === 0 ) {
                value = defaultValue;
            } else {
                result = values;
            }

        } else {
            result = getDefaultArray( value, defaultValue );
        }

        return result;
    }
}