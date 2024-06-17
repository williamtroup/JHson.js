/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        jhson.js
 * @version     v1.2.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


var jhson = {
    js: function() {
        return window.$jhson;
    }
};

Object.assign( window, { jhson } );

export { jhson };