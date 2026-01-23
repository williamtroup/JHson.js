/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        dom.ts
 * @version     v2.4.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Char } from "../data/enum";


export namespace DomElement {
    export function create( container: HTMLElement, type: string ) : HTMLElement {
        const result: any = createWithNoContainer( type );
        container.appendChild( result );

        return result;
    }

    export function createWithNoContainer( type: string ) : HTMLElement {
        const nodeType: string = type.toLowerCase();
        const isText: boolean = nodeType === "text";
        const result: any = isText ? document.createTextNode( Char.empty ) : document.createElement( nodeType );

        return result;
    }
}