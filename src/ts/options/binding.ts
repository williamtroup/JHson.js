/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        binding.ts
 * @version     v2.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    type BindingOptionsCurrentView,
    type BindingOptions,
    type BindingOptionsEvents,
    type HtmlProperties } from "../type";

import { Default } from "../data/default";


export namespace Binding {
    export namespace Options {
        export function getForNewInstance( data: any, element: HTMLElement, propertyDefaults: HtmlProperties ) : BindingOptions {
            const bindingOptions: BindingOptions = get( data, propertyDefaults );

            bindingOptions._currentView = {} as BindingOptionsCurrentView;
            bindingOptions._currentView.element = element;

            return bindingOptions;
        }

        export function get( newOptions: any, propertyDefaults: HtmlProperties ) : BindingOptions {
            let options: BindingOptions = Default.getDefaultObject( newOptions, {} as BindingOptions );
            options.json = Default.getDefaultString( options.json, propertyDefaults.json );
            options.templateData = Default.getDefaultObject( options.templateData, propertyDefaults.templateData );
            options.removeOriginalAttributes = Default.getDefaultBoolean( options.removeOriginalAttributes, propertyDefaults.removeOriginalAttributes );
            options.clearOriginalHTML = Default.getDefaultBoolean( options.clearOriginalHTML, propertyDefaults.clearOriginalHTML );
            options.addCssToHead = Default.getDefaultBoolean( options.addCssToHead, propertyDefaults.addCssToHead );
            options.clearCssFromHead = Default.getDefaultBoolean( options.clearCssFromHead, propertyDefaults.clearCssFromHead );
            options.logTemplateDataWarnings = Default.getDefaultBoolean( options.logTemplateDataWarnings, propertyDefaults.logTemplateDataWarnings );
            options.addAttributes = Default.getDefaultBoolean( options.addAttributes, propertyDefaults.addAttributes );
            options.addCssProperties = Default.getDefaultBoolean( options.addCssProperties, propertyDefaults.addCssProperties );
            options.addText = Default.getDefaultBoolean( options.addText, propertyDefaults.addText );
            options.addChildren = Default.getDefaultBoolean( options.addChildren, propertyDefaults.addChildren );

            options = getCustomTriggers( options );
    
            return options;
        }
    
        function getCustomTriggers( options: BindingOptions ) : BindingOptions {
            options.events = Default.getDefaultObject( options.events, {} as BindingOptionsEvents );
            options.events!.onBeforeRender = Default.getDefaultFunction( options.events!.onBeforeRender, null! );
            options.events!.onRenderComplete = Default.getDefaultFunction( options.events!.onRenderComplete, null! );

            return options;
        }
    }
}