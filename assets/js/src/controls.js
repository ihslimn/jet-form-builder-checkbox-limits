import {
	CHECKBOX_LIMITS_ENABLED,
	CHECKBOX_LIMITS_MIN,
	CHECKBOX_LIMITS_MAX,
	SUPPORTED_BLOCKS,
	CHECKBOX_LIMITS_MIN_MESSAGE,
	CHECKBOX_LIMITS_MAX_MESSAGE,
	CHECKBOX_LIMITS_BLOCK_OPTIONS,
} from './constants';

const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;

const { InspectorControls } = wp.blockEditor;
const { 
	TextControl,
	ToggleControl,
	Panel,
	PanelRow,
	PanelBody,
	__experimentalNumberControl: NumberControl
} = wp.components;

const addControls = createHigherOrderComponent( ( BlockEdit ) => {

	return ( props ) => {

		let blockName = props.name,
			supportType = SUPPORTED_BLOCKS[ blockName ] || false;

		if ( ! supportType ) {
			return ( <BlockEdit { ...props } /> );
		}

		const {
			attributes,
			setAttributes,
			isSelected,
		} = props;

		if ( supportType !== 'all' && ! attributes[ supportType ] ) {
			return ( <BlockEdit { ...props } /> );
		}

		return (
			<>
				<BlockEdit { ...props } />
				{ isSelected &&
					<InspectorControls>
						<Panel>
							{ 
							<PanelBody title="Checkbox limits" initialOpen={ false }>
								{ <PanelRow>
										<ToggleControl
											label="Enable"
											help={
												attributes[ CHECKBOX_LIMITS_ENABLED ]
													? 'Enabled.'
													: 'Disabled.'
											}
											checked={ attributes[ CHECKBOX_LIMITS_ENABLED ] }
											onChange={ () => {
												setAttributes( { [ CHECKBOX_LIMITS_ENABLED ] : ! attributes[ CHECKBOX_LIMITS_ENABLED ] } );
											} }
										/>
									</PanelRow> 
								}
								{ attributes[ CHECKBOX_LIMITS_ENABLED ] &&
									<PanelRow>
										<NumberControl
											label="Minimum selected options"
											help={ '0 for unlimited' }
											value={ attributes[ CHECKBOX_LIMITS_MIN ] }
											min='0'
											onChange={ newValue => {
												setAttributes( { [ CHECKBOX_LIMITS_MIN ] : newValue } );
											} }
										/>
									</PanelRow> 
								}
								{ attributes[ CHECKBOX_LIMITS_ENABLED ] &&
									<PanelRow>
										<NumberControl
											label="Maximum selected options"
											help={ '0 for unlimited' }
											value={ attributes[ CHECKBOX_LIMITS_MAX ] }
											min='0'
											onChange={ newValue => {
												setAttributes( { [ CHECKBOX_LIMITS_MAX ] : newValue } );
											} }
										/>
									</PanelRow> 
								}
								{ attributes[ CHECKBOX_LIMITS_ENABLED ] && attributes[ CHECKBOX_LIMITS_MAX ] > 0 && 
									<PanelRow>
										<ToggleControl
											label="Block options when max limit reached"
											help={
												attributes[ CHECKBOX_LIMITS_BLOCK_OPTIONS ]
													? 'Enabled.'
													: 'Disabled.'
											}
											checked={ attributes[ CHECKBOX_LIMITS_BLOCK_OPTIONS ] }
											onChange={ () => {
												setAttributes( { [ CHECKBOX_LIMITS_BLOCK_OPTIONS ] : ! attributes[ CHECKBOX_LIMITS_BLOCK_OPTIONS ] } );
											} }
										/>
									</PanelRow> 
								}
								{ attributes[ CHECKBOX_LIMITS_ENABLED ] && attributes[ CHECKBOX_LIMITS_MIN ] > 0 &&
									<PanelRow>
										<TextControl
											label="Error message for min"
											help={ '' }
											value={ attributes[ CHECKBOX_LIMITS_MIN_MESSAGE ] }
											onChange={ newValue => {
												setAttributes( { [ CHECKBOX_LIMITS_MIN_MESSAGE ] : newValue } );
											} }
										/>
									</PanelRow> 
								}
								{ attributes[ CHECKBOX_LIMITS_ENABLED ] && attributes[ CHECKBOX_LIMITS_MAX ] > 0 && ! attributes[ CHECKBOX_LIMITS_BLOCK_OPTIONS ] &&
									<PanelRow>
										<TextControl
											label="Error message for max"
											help={ '' }
											value={ attributes[ CHECKBOX_LIMITS_MAX_MESSAGE ] }
											onChange={ newValue => {
												setAttributes( { [ CHECKBOX_LIMITS_MAX_MESSAGE ] : newValue } );
											} }
										/>
									</PanelRow> 
								}
							</PanelBody>
							}
						</Panel>
					</InspectorControls>
				}
			</>
		);
	};

}, 'addControls' );

addFilter(
	'editor.BlockEdit',
	'jfb-select-all-options/editor-controls',
	addControls
);
