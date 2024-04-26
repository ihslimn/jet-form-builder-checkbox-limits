<?php

namespace JetFormBuilder_Checkbox_Limits;

use \JetFormBuilder_Checkbox_Limits\Plugin;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die();
}

class Block_Attributes {

	public $script_enqueued = false;

	public function __construct() {
		add_action( 'jet-form-builder/before-start-form-row', array( $this, 'add_attributes' ) );	
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ), -100 );
	}

	public function select_is_not_multiple( $args ) {
		$block_name = $args['blockName'] ?? '';

		if ( $block_name !== 'jet-forms/select-field' ) {
			return false;
		}

		return empty( $args['multiple'] );
	}

	public function add_attributes( $block ) {
		$args = $block->block_attrs;

		if ( empty( $args['jfb_checkbox_limits_enabled'] ) || $this->select_is_not_multiple( $args ) ) {
			return;
		}

		$min = $args['jfb_checkbox_limits_min'] ?? '0';
		$max = $args['jfb_checkbox_limits_max'] ?? '0';

		if ( ! $min && ! $max ) {
			return;
		}

		$block->add_attribute( 'data-checkbox-limits', '1' );

		if ( $min ) {
			$min_message = ! empty( $args['jfb_checkbox_limits_min_message'] )
			               ? $args['jfb_checkbox_limits_min_message']
			               : 'Check at least %this(minCheckedOptions)% option(s)';

			$block->add_attribute( 'data-checkbox-limits-min', $min );
			$block->add_attribute( 'data-checkbox-limits-min-message', $min_message );
		}
	
		if ( $max ) {
			$block->add_attribute( 'data-checkbox-limits-max', $max );
			$block_options = $args['jfb_checkbox_limits_block_options'] ?? '0';
			$block->add_attribute( 'data-checkbox-limits-block-options', $block_options );
			if ( ! $block_options ) {
				$max_message = ! empty( $args['jfb_checkbox_limits_max_message'] )
		               ? $args['jfb_checkbox_limits_max_message']
					   : 'Check no more than %this(maxCheckedOptions)% option(s)';
				$block->add_attribute( 'data-checkbox-limits-max-message', $max_message );
			}
		}
		
		$block->add_attribute( 'data-validation-type', 'advanced' );
	}

	public function enqueue_scripts() {
		wp_enqueue_script(
			'jfb-checkbox-limits',
			Plugin::instance()->get_url( '/assets/js/frontend.js' ),
			array( 'jet-plugins' ),
			Plugin::instance()->version,
			false
		);
	}

}
