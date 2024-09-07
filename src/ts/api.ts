/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        api.ts
 * @version     v2.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


export type PublicApiJson = {
    /**
     * includeAttributes().
     * 
     * States if the attributes should be included.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
     * 
     * @returns     {Object}                                        The JSON properties object.
     */
    includeAttributes: ( flag: boolean ) => PublicApiJson;

    /**
     * includeCssProperties().
     * 
     * States if the CSS style properties should be included.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to false).
     * 
     * @returns     {Object}                                        The JSON properties object.
     */
    includeCssProperties: ( flag: boolean ) => PublicApiJson;

    /**
     * includeText().
     * 
     * States if the node text should be included.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
     * 
     * @returns     {Object}                                        The JSON properties object.
     */
    includeText: ( flag: boolean ) => PublicApiJson;

    /**
     * includeChildren().
     * 
     * States if the children should be included.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
     * 
     * @returns     {Object}                                        The JSON properties object.
     */
    includeChildren: ( flag: boolean ) => PublicApiJson;

    /**
     * friendlyFormat().
     * 
     * States if the JSON should be formatted in an easy-to-read layout.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
     * 
     * @returns     {Object}                                        The JSON properties object.
     */
    friendlyFormat: ( flag: boolean ) => PublicApiJson;

    /**
     * indentSpaces().
     * 
     * States the total indent spaces that should be used for the friendly format JSON.
     * 
     * @public
     * 
     * @param       {number}    flag                                The spaces value that should be used (defaults to 2).
     * 
     * @returns     {Object}                                        The JSON properties object.
     */
    indentSpaces: ( spaces: number ) => PublicApiJson;

    /**
     * ignoreNodeTypes().
     * 
     * States the node types that should not be included in the JSON.
     * 
     * @public
     * 
     * @param       {Object}    types                               The node types to ignore (can be an array of strings, or a space separated string, and defaults to []).
     * 
     * @returns     {Object}                                        The JSON properties object.
     */
    ignoreNodeTypes: ( types: string[] | string ) => PublicApiJson;

    /**
     * ignoreCssProperties().
     * 
     * States the CSS properties that should not be included in the JSON.
     * 
     * @public
     * 
     * @param       {Object}    cssProperties                       The CSS properties to ignore (can be an array of strings, or a space separated string, and defaults to []).
     * 
     * @returns     {Object}                                        The JSON properties object.
     */
    ignoreCssProperties: ( cssProperties: string[] | string ) => PublicApiJson;

    /**
     * ignoreAttributes().
     * 
     * States the attributes that should not be included in the JSON.
     * 
     * @public
     * 
     * @param       {Object}    attributes                          The attributes to ignore (can be an array of strings, or a space separated string, and defaults to []).
     * 
     * @returns     {Object}                                        The JSON properties object.
     */
    ignoreAttributes: ( attributes: string[] | string ) => PublicApiJson;

    /**
     * generateUniqueMissingIds().
     * 
     * States if the JSON should include unique IDs for DOM elements that don't have them set already.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
     * 
     * @returns     {Object}                                        The JSON properties object.
     */
    generateUniqueMissingIds: ( flag: boolean ) => PublicApiJson;

    /**
     * get().
     * 
     * Uses all the options selected via the chained functions to get the JSON from the HTML DOM element.
     * 
     * @public
     * 
     * @param       {Object}    element                             The DOM element to get the JSON for.
     * 
     * @returns     {string}                                        The JSON string.
     */
    get: ( element: HTMLElement ) => string;

    /**
     * getVariables().
     * 
     * Uses all the options selected via the chained functions to get the template variables from a JSON string.
     * 
     * @public
     * 
     * @param       {string}    json                                The JSON to get the template variables from.
     * 
     * @returns     {string[]}                                      The template variables.
     */
    getVariables: ( json: string ) => string[];
};

export type PublicApiHtml = {
    /**
     * json().
     * 
     * States the JSON that should be written as HTML DOM elements.
     * 
     * @public
     * 
     * @param       {string}    json                                The JSON that should be converted to HTML.
     * 
     * @returns     {Object}                                        The HTML properties object.
     */
    json: ( json: string ) => PublicApiHtml;

    /**
     * templateData().
     * 
     * States the template data that should be used inside each HTML DOM elements HTML.
     * 
     * @public
     * 
     * @param       {Object}    templateData                        The template data to set inside each node's HTML.
     * 
     * @returns     {Object}                                        The HTML properties object.
     */
    templateData: ( templateData: Record<string, string> ) => PublicApiHtml;

    /**
     * removeOriginalAttributes().
     * 
     * States if the original attributes on the element should be removed.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
     * 
     * @returns     {Object}                                        The HTML properties object.
     */
    removeOriginalAttributes: ( flag: boolean ) => PublicApiHtml;

    /**
     * clearOriginalHTML().
     * 
     * States if the original HTML in the element should be cleared.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
     * 
     * @returns     {Object}                                        The HTML properties object.
     */
    clearOriginalHTML: ( flag: boolean ) => PublicApiHtml;

    /**
     * addCssToHead().
     * 
     * States if the CSS style properties should be written to a "style" tag in the HTML documents HEAD DOM element.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to false).
     * 
     * @returns     {Object}                                        The HTML properties object.
     */
    addCssToHead: ( flag: boolean ) => PublicApiHtml;

    /**
     * clearCssFromHead().
     * 
     * States if all the CSS style tags should be cleared from the HTML documents HEAD DOM element.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to false).
     * 
     * @returns     {Object}                                        The HTML properties object.
     */
    clearCssFromHead: ( flag: boolean ) => PublicApiHtml;

    /**
     * logTemplateDataWarnings().
     * 
     * States if the template data variables not found in any data are logged as warnings.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
     * 
     * @returns     {Object}                                        The HTML properties object.
     */
    logTemplateDataWarnings: ( flag: boolean ) => PublicApiHtml;

    /**
     * addAttributes().
     * 
     * States if the attributes should be written for each element.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
     * 
     * @returns     {Object}                                        The HTML properties object.
     */
    addAttributes: ( flag: boolean ) => PublicApiHtml;

    /**
     * addCssProperties().
     * 
     * States if the CSS properties should be written for each element.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
     * 
     * @returns     {Object}                                        The HTML properties object.
     */
    addCssProperties: ( flag: boolean ) => PublicApiHtml;

    /**
     * addText().
     * 
     * States if the text should be written for each element.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
     * 
     * @returns     {Object}                                        The HTML properties object.
     */
    addText: ( flag: boolean ) => PublicApiHtml;

    /**
     * addChildren().
     * 
     * States if the children should be written for each element.
     * 
     * @public
     * 
     * @param       {boolean}    flag                               The boolean flag that states the condition (defaults to true).
     * 
     * @returns     {Object}                                        The HTML properties object.
     */
    addChildren: ( flag: boolean ) => PublicApiHtml;

    /**
     * write().
     * 
     * Uses all the options selected via the chained functions to convert the JSON into HTML DOM elements.
     * 
     * @public
     * 
     * @param       {Object}    element                             The DOM element to add the new JSON HTML nodes to.
     * 
     * @returns     {string}                                        The JHson.js class instance.
     */
    write: ( element: HTMLElement ) => PublicApi;

    /**
     * getVariables().
     * 
     * Uses all the options selected via the chained functions to get the template variables from a HTML DOM element.
     * 
     * @public
     * 
     * @param       {Object}    element                             The DOM element to get the template variables from.
     * 
     * @returns     {string[]}                                      The template variables.
     */
    getVariables: ( element: HTMLElement ) => string[];
};


export type PublicApi = {
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  JSON
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * json().
     * 
     * Returns all the chained functions that will allow an HTML DOM element to be converted to JSON.
     * 
     * @public
     * 
     * @returns     {Object}                                                The JSON properties object.
     */
    json: () => PublicApiJson;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  HTML
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * html().
     * 
     * Returns all the chained functions that will allow JSON to be written as HTML DOM elements.
     * 
     * @public
     * 
     * @returns     {Object}                                                The HTML properties object.
     */
    html: () => PublicApiHtml;

    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Configuration
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * setConfiguration().
     * 
     * Sets the specific configuration options that should be used.
     * 
     * @public
     * 
     * @param       {Object}    newConfiguration                            All the configuration options that should be set (refer to "Configuration Options" documentation for properties).
     * 
     * @returns     {Object}                                                The JHson.js class instance.
     */
    setConfiguration: ( newConfiguration: any ) => PublicApi;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Additional Data
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * getVersion().
     * 
     * Returns the version of JHson.js.
     * 
     * @public
     * 
     * @returns     {string}                                                The version number.
     */
    getVersion: () => string;
};

declare global {
	interface Window {
		$jhson: PublicApi;
	}
}