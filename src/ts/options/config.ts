/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        config.ts
 * @version     v2.3.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type ConfigurationText, type Configuration } from "../type";
import { Default } from "../data/default";


export namespace Config {
    export namespace Options {
        export function get( newConfiguration: any = null ) : Configuration {
            let configuration: Configuration = Default.getObject( newConfiguration, {} as Configuration );
            configuration.safeMode = Default.getBoolean( configuration.safeMode, true );
            configuration.domElementTypes = Default.getStringOrArray( configuration.domElementTypes, [ "*" ] );
            configuration.formattingNodeTypes = Default.getStringOrArray( configuration.formattingNodeTypes, [
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
    
            configuration = getText( configuration );

            return configuration;
        }
    
        function getText( configuration: Configuration ) : Configuration {
            configuration.text = Default.getObject( configuration.text, {} as ConfigurationText );
            configuration.text!.variableWarningText = Default.getString( configuration.text!.variableWarningText, "Template variable {{variable_name}} not found." );
            configuration.text!.objectErrorText = Default.getString( configuration.text!.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}" );
            configuration.text!.attributeNotValidErrorText = Default.getString( configuration.text!.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object." );
            configuration.text!.attributeNotSetErrorText = Default.getString( configuration.text!.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly." );
            
            return configuration;
        }
    }
}