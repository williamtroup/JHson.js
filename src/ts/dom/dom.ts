/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        dom.ts
 * @version     v2.4.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2026
 */


import { Char } from "../data/enum";
import { Is } from "../data/is";


export namespace DomElement {
    export function create( container: HTMLElement, type: string, beforeNode: HTMLElement = null! ) : HTMLElement {
        const nodeType: string = type.toLowerCase();
        const result: HTMLElement = document.createElement( nodeType );

        if ( Is.defined( beforeNode ) ) {
            container.insertBefore( result, beforeNode );
        } else {
            container.appendChild( result );
        }

        return result;
    }

    export function createWithNoContainer( type: string ) : HTMLElement {
        const nodeType: string = type.toLowerCase();
        const isText: boolean = nodeType === "text";
        const result: any = isText ? document.createTextNode( Char.empty ) : document.createElement( nodeType );

        return result;
    }
}