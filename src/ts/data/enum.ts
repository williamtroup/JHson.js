/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        enum.ts
 * @version     v2.2.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


export const enum Char {
    empty = "",
    space = " ",
    newLine = "\n",
    variableStart = "{{",
    variableEnd = "}}",
    variableDefault = "|",
    dash = "-",
}

export const enum Value {
    notFound = -1,
}

export const enum JsonValue {
    text = "#text",
    cssStyle = "$",
    attribute = "@",
    children = "&children",
}