<?php

namespace JetFormBuilder_Checkbox_Limits;

use \JetFormBuilder_Checkbox_Limits\Plugin;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die();
}

class Assets {

	public function __construct() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'editor_scripts' ), -100 );
		add_action( 'wp_enqueue_scripts', array( $this, 'frontend_scripts' ), -100 );
	}

	public function editor_scripts() {
		wp_enqueue_script(
			'jfb-checkbox-limits-editor',
			Plugin::instance()->get_url( '/assets/js/blocks.js' ),
			array( 'wp-components', 'wp-element', 'wp-blocks', 'wp-block-editor', 'wp-edit-post' ),
			Plugin::instance()->version,
			false
		);
	}

	public function frontend_scripts() {
		wp_enqueue_script(
			'jfb-checkbox-limits-frontend',
			Plugin::instance()->get_url( '/assets/js/frontend.js' ),
			array( 'jet-plugins' ),
			Plugin::instance()->version,
			false
		);
	}

}
