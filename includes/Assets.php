<?php

namespace JetFormBuilder_Checkbox_Limits;

use \JetFormBuilder_Checkbox_Limits\Plugin;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die();
}

class Assets {

	public function __construct() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'block_assets' ), -100 );
	}

	public function block_assets() {

		wp_enqueue_script(
			'jfb-select-all-options',
			Plugin::instance()->get_url( '/assets/js/blocks.js' ),
			array( 'wp-components', 'wp-element', 'wp-blocks', 'wp-block-editor', 'wp-edit-post' ),
			Plugin::instance()->version,
			false
		);

	}

}
