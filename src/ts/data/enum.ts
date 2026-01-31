/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        enum.ts
 * @version     v2.4.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2026
 */


export enum Char {
    empty = "",
    space = " ",
    newLine = "\n",
    variableStart = "{{",
    variableEnd = "}}",
    variableDefault = "|",
    dash = "-",
    dataAttributeStart = "data-",
    id = "id",
    name = "name",
    comma = ",",
    dot = ".",
}

export enum Value {
    notFound = -1,
}

export enum JsonValue {
    text = "#text",
    cssStyle = "$",
    attribute = "@",
    children = "&children",
}