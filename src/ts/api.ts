/**
 * JHson.js
 * 
 * A JavaScript library for converting between HTML and JSON, with binding, templating, attributes, and CSS support.
 * 
 * @file        api.js
 * @version     v2.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


export type PublicApi = {



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