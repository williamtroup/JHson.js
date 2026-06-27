/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        document-element.ts
 * @version     v2.5.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2026
 */


export namespace DocumentElement {
    export function onContentLoaded( onLoadFunc: Function ) : void {
        if ( document.readyState === "loading" ) {
            document.addEventListener( "DOMContentLoaded", () : void => onLoadFunc() );
        } else {
            onLoadFunc();
        }
    }
}