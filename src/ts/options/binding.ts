/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        binding.ts
 * @version     v2.2.0
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
            let options: BindingOptions = Default.getObject( newOptions, {} as BindingOptions );
            options.json = Default.getString( options.json, propertyDefaults.json );
            options.templateData = Default.getObject( options.templateData, propertyDefaults.templateData );
            options.removeOriginalAttributes = Default.getBoolean( options.removeOriginalAttributes, propertyDefaults.removeOriginalAttributes );
            options.clearOriginalHTML = Default.getBoolean( options.clearOriginalHTML, propertyDefaults.clearOriginalHTML );
            options.addCssToHead = Default.getBoolean( options.addCssToHead, propertyDefaults.addCssToHead );
            options.clearCssFromHead = Default.getBoolean( options.clearCssFromHead, propertyDefaults.clearCssFromHead );
            options.logTemplateDataWarnings = Default.getBoolean( options.logTemplateDataWarnings, propertyDefaults.logTemplateDataWarnings );
            options.addAttributes = Default.getBoolean( options.addAttributes, propertyDefaults.addAttributes );
            options.addCssProperties = Default.getBoolean( options.addCssProperties, propertyDefaults.addCssProperties );
            options.addText = Default.getBoolean( options.addText, propertyDefaults.addText );
            options.addChildren = Default.getBoolean( options.addChildren, propertyDefaults.addChildren );

            options = getCustomTriggers( options );
    
            return options;
        }
    
        function getCustomTriggers( options: BindingOptions ) : BindingOptions {
            options.events = Default.getObject( options.events, {} as BindingOptionsEvents );
            options.events!.onBeforeRender = Default.getFunction( options.events!.onBeforeRender, null! );
            options.events!.onRenderComplete = Default.getFunction( options.events!.onRenderComplete, null! );

            return options;
        }
    }
}