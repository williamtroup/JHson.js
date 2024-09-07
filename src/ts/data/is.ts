/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        is.ts
 * @version     v2.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Char } from "./enum";


export namespace Is {
    export function defined( value: any ) : boolean {
        return value !== null && value !== undefined && value.toString() !== Char.empty;
    }

    export function definedObject( object: any ) : boolean {
        return defined( object ) && typeof object === "object";
    }

    export function definedBoolean( object: any ) : boolean {
        return defined( object ) && typeof object === "boolean";
    }

    export function definedString( object: any ) : boolean {
        return defined( object ) && typeof object === "string";
    }

    export function definedFunction( object: any ) : boolean {
        return defined( object ) && typeof object === "function";
    }

    export function definedNumber( object: any ) : boolean {
        return defined( object ) && typeof object === "number";
    }

    export function definedArray( object: any ) : boolean {
        return definedObject( object ) && object instanceof Array;
    }
}