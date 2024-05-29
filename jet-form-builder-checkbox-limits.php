<?php
/**
 * Plugin Name: JetFormBuilder - Checkbox Limits
 * Plugin URI:  
 * Description: 
 * Version:     1.0.1
 * Author:      Crocoblock
 * Author URI:  https://github.com/ihslimn/
 * Text Domain: 
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path: /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die();
}

require_once( 'vendor/autoload.php' );

add_action( 'plugins_loaded', function() {
	JetFormBuilder_Checkbox_Limits\Plugin::instance();
}, 0 );
