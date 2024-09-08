/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        type.ts
 * @version     v2.2.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


export type JsonPropertyReplacer = ( key: string, value: any ) => any;
export type IgnoreNodeCondition = ( element: HTMLElement ) => boolean;

export type StringToJson = {
    parsed: boolean;
    object: any;
};

export interface HtmlProperties {
    json: string;
    templateData: Record<string, string>;
    removeOriginalAttributes: boolean;
    removeOriginalDataAttributes: boolean;
    clearOriginalHTML: boolean;
    addCssToHead: boolean;
    clearCssFromHead: boolean;
    logTemplateDataWarnings: boolean;
    addAttributes: boolean;
    addDataAttributes: boolean;
    addCssProperties: boolean;
    addText: boolean;
    addChildren: boolean;
    insertBefore: boolean;
};

export type Configuration = {
    safeMode?: boolean;
    domElementTypes?: string[] | string;
    formattingNodeTypes: string[] | string;
    text?: ConfigurationText;
};

export type ConfigurationText = {
    variableWarningText?: string;
    objectErrorText?: string;
    attributeNotValidErrorText?: string;
    attributeNotSetErrorText?: string;
};

export interface BindingOptions extends HtmlProperties {
    _currentView: BindingOptionsCurrentView;
    events?: BindingOptionsEvents;
};

export type BindingOptionsEvents = {
    onBeforeRender?: ( element: HTMLElement ) => void;
    onRenderComplete?: ( element: HTMLElement ) => void;
};

export type BindingOptionsCurrentView = {
    element: HTMLElement;
};