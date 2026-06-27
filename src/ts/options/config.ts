/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        config.ts
 * @version     v2.5.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2026
 */


import { type ConfigurationOptionsText, type ConfigurationOptions } from "../type";
import { Default } from "../data/default";


export namespace Configuration {
    export namespace Options {
        export function get( newConfigurationOptions: unknown = null ) : ConfigurationOptions {
            let configurationOptions: ConfigurationOptions = Default.getObject( newConfigurationOptions, {} as ConfigurationOptions );
            configurationOptions.safeMode = Default.getBoolean( configurationOptions.safeMode, true );
            configurationOptions.domElementTypes = Default.getStringOrArray( configurationOptions.domElementTypes, [ "*" ] );
            configurationOptions.formattingNodeTypes = Default.getStringOrArray( configurationOptions.formattingNodeTypes, [
                "b",
                "strong",
                "i",
                "em",
                "mark",
                "small",
                "del",
                "ins",
                "sub",
                "sup"
            ] );
    
            configurationOptions = getText( configurationOptions );

            return configurationOptions;
        }
    
        function getText( configurationOptions: ConfigurationOptions ) : ConfigurationOptions {
            configurationOptions.text = Default.getObject( configurationOptions.text, {} as ConfigurationOptionsText );
            configurationOptions.text!.variableWarningText = Default.getString( configurationOptions.text!.variableWarningText, "Template variable {{variable_name}} not found." );
            configurationOptions.text!.objectErrorText = Default.getString( configurationOptions.text!.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}" );
            configurationOptions.text!.attributeNotValidErrorText = Default.getString( configurationOptions.text!.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object." );
            configurationOptions.text!.attributeNotSetErrorText = Default.getString( configurationOptions.text!.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly." );
            
            return configurationOptions;
        }
    }
}