/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        type.ts
 * @version     v2.4.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2026
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

export type ConfigurationOptions = {
    safeMode?: boolean;
    domElementTypes?: string[] | string;
    formattingNodeTypes: string[] | string;
    text?: ConfigurationOptionsText;
};

export type ConfigurationOptionsText = {
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