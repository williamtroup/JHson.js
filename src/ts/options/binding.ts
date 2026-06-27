/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        binding.ts
 * @version     v2.5.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2026
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

        export function get( newBindingOptions: unknown, propertyDefaults: HtmlProperties ) : BindingOptions {
            let bindingOptions: BindingOptions = Default.getObject( newBindingOptions, {} as BindingOptions );
            bindingOptions.json = Default.getString( bindingOptions.json, propertyDefaults.json );
            bindingOptions.templateData = Default.getObject( bindingOptions.templateData, propertyDefaults.templateData );
            bindingOptions.removeOriginalAttributes = Default.getBoolean( bindingOptions.removeOriginalAttributes, propertyDefaults.removeOriginalAttributes );
            bindingOptions.removeOriginalDataAttributes = Default.getBoolean( bindingOptions.removeOriginalDataAttributes, propertyDefaults.removeOriginalDataAttributes );
            bindingOptions.clearOriginalHTML = Default.getBoolean( bindingOptions.clearOriginalHTML, propertyDefaults.clearOriginalHTML );
            bindingOptions.addCssToHead = Default.getBoolean( bindingOptions.addCssToHead, propertyDefaults.addCssToHead );
            bindingOptions.clearCssFromHead = Default.getBoolean( bindingOptions.clearCssFromHead, propertyDefaults.clearCssFromHead );
            bindingOptions.logTemplateDataWarnings = Default.getBoolean( bindingOptions.logTemplateDataWarnings, propertyDefaults.logTemplateDataWarnings );
            bindingOptions.addAttributes = Default.getBoolean( bindingOptions.addAttributes, propertyDefaults.addAttributes );
            bindingOptions.addDataAttributes = Default.getBoolean( bindingOptions.addDataAttributes, propertyDefaults.addDataAttributes );
            bindingOptions.addCssProperties = Default.getBoolean( bindingOptions.addCssProperties, propertyDefaults.addCssProperties );
            bindingOptions.addText = Default.getBoolean( bindingOptions.addText, propertyDefaults.addText );
            bindingOptions.addChildren = Default.getBoolean( bindingOptions.addChildren, propertyDefaults.addChildren );
            bindingOptions.insertBefore = Default.getBoolean( bindingOptions.insertBefore, propertyDefaults.insertBefore );

            bindingOptions = getCustomTriggers( bindingOptions );
    
            return bindingOptions;
        }
    
        function getCustomTriggers( bindingOptions: BindingOptions ) : BindingOptions {
            bindingOptions.events = Default.getObject( bindingOptions.events, {} as BindingOptionsEvents );
            bindingOptions.events!.onBeforeRender = Default.getFunction( bindingOptions.events!.onBeforeRender, null! );
            bindingOptions.events!.onRenderComplete = Default.getFunction( bindingOptions.events!.onRenderComplete, null! );

            return bindingOptions;
        }
    }
}