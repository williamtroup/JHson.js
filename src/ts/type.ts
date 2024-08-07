/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        type.js
 * @version     v2.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


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

export type BindingOptions = {
    _currentView: CurrentView;
    json?: string;
    templateData?: object;
    removeOriginalAttributes?: boolean;
    clearOriginalHTML?: boolean;
    addCssToHead?: boolean;
    clearCssFromHead?: boolean;
    logTemplateDataWarnings?: boolean;
    addAttributes?: boolean;
    addCssProperties?: boolean;
    addText?: boolean;
    addChildren?: boolean;
    events?: BindingOptionEvents;
};

export type BindingOptionEvents = {
    onBeforeRender?: ( element: HTMLElement ) => void;
    onRenderComplete?: ( element: HTMLElement ) => void;
}

export type CurrentView = {
    element: HTMLElement;
};