const {
		addAction,
		addFilter,
	} = window.JetPlugins.hooks;

addAction(
	'jet.fb.input.makeReactive',
	'jfb-checkbox-limits/min-max',
	applyOptionsBlocking
);

addFilter(
	'jet.fb.restrictions',
	'jfb-checkbox-limits/min-max',
	addRestrictionTypes
);

addFilter(
	'jet.fb.input.html.attrs',
	'jfb-checkbox-limits/min-max',
	addAttributeTypes
);

function applyOptionsBlocking( input ) {

	if ( ! input.nodes?.length ) {
		return;
	}

	if ( input.nodes[0]?.type !== 'select-multiple' && input.inputType !== 'checkbox' ) {
		return;
	}

	const limits = input.nodes[0].closest( '[data-checkbox-limits]' );

	if ( ! limits ) {
		return;
	}

	const {
		maxCheckedOptions: max,
		checkedOptions: checked,
	} = input.attrs;

	if ( limits.dataset?.checkboxLimitsBlockOptions === '1' ) {
		input.value.watch( function() {
			const isFull = + checked.value.current >= + max.value.current

			for ( const node of input.nodes ) {
				if ( node.checked ) {
					continue;
				}

				node.disabled = isFull;
			}
		} );
	}

	for ( const attrName in limits.dataset ) {
		if ( attrName !== 'checkboxLimits' ) {
			const trueName = 'data-' + attrName.replaceAll(
					/[A-Z]/g,
					function( match ) {
						return '-' + match.toLowerCase();
					}
				);

			limits.removeAttribute( trueName );
		}
	}

	input.report();
}

function addRestrictionTypes( restrictions ) {

	const { AdvancedRestriction } = JetFormBuilderAbstract;

	function MinCheckedRestriction() {
		AdvancedRestriction.call( this );

		this.getSlug  = function () {
			return 'min-checked-options';
		};

		this.watchedAttrs.push( 'checkedOptions' );

		this.getLimits = function () {
			return this.reporting.input.nodes[0]?.closest( '[data-checkbox-limits]' )?.dataset;
		}

		this.getRawMessage = function () {
			return this.getLimits().checkboxLimitsMinMessage;
		};

		this.validate = function() {
			const { current } = this.reporting.input.value;
			const { minCheckedOptions: min } = this.reporting.input.attrs;

			const pass = ! min || current.length >= + min.value.current;

			return pass;
		};

		this.isSupported = function( node, reporting ) {
			return node.closest( '[data-checkbox-limits]' );
		}
	}
	
	MinCheckedRestriction.prototype = Object.create( AdvancedRestriction.prototype );

	function MaxCheckedRestriction() {
		MinCheckedRestriction.call( this );
	
		this.getSlug  = function () {
			return 'max-checked-options';
		};

		this.getRawMessage = function () {
			return this.getLimits().checkboxLimitsMaxMessage;
		};

		this.validate = function () {
			const { current } = this.reporting.input.value;
			const { maxCheckedOptions: max } = this.reporting.input.attrs;
	
			const pass = ! max || current.length <= + max.value.current;

			return pass;
		};
	}
	
	MaxCheckedRestriction.prototype = Object.create( MinCheckedRestriction.prototype );

	restrictions.push( 
		MinCheckedRestriction,
		MaxCheckedRestriction,
	);

	return restrictions;
}

function addAttributeTypes( types ) {

	const {
		BaseHtmlAttr = () => {},
	} = JetFormBuilderAbstract;

	function CheckedOptionsNumberAttr() {
		BaseHtmlAttr.call( this );
	
		this.attrName = 'checkedOptions';
	
		this.isSupported = function ( input ) {
			return input?.nodes?.length && input.nodes[0].closest( '[data-checkbox-limits]' );
		};
	
		this.updateAttr = function () {
			let { current } = this.input.value;
	
			this.value.current = current.length ?? 0;
		};
	
		this.addWatcherAttr = function () {
			this.input.value.watch( () => this.updateAttr() );
		};
	
		this.setInput = function ( input ) {
			BaseHtmlAttr.prototype.setInput.call( this, input );
	
			const [ node ] = input.nodes;
	
			this.inputType = node.type;
		};
	}
	
	CheckedOptionsNumberAttr.prototype = Object.create( BaseHtmlAttr.prototype );

	function MinCheckedOptionsAttr() {
		BaseHtmlAttr.call( this );

		this.attrName = 'minCheckedOptions';

		this.isSupported = function ( input ) {
			return input?.nodes?.length && input.nodes[0].closest( '[data-checkbox-limits]' );
		};

		this.getLimits = function ( input = false ) {
			if ( ! input ) {
				input = this.input;
			}

			return input.nodes[0]?.closest( '[data-checkbox-limits]' )?.dataset;
		}

		this.setInitialValue = function () {
			return parseInt( this.getLimits()?.checkboxLimitsMin ?? 0 );
		}
	
		this.setInput = function ( input ) {
			BaseHtmlAttr.prototype.setInput.call( this, input );
	
			const [ node ] = input.nodes;
	
			this.inputType = node.type;

			this.initial = this.setInitialValue();
		};
	}

	MinCheckedOptionsAttr.prototype = Object.create( BaseHtmlAttr.prototype );

	function MaxCheckedOptionsAttr() {
		MinCheckedOptionsAttr.call( this );

		this.attrName = 'maxCheckedOptions';

		this.setInitialValue = function () {
			return parseInt( this.getLimits()?.checkboxLimitsMax ?? 0 );
		}
	}

	MaxCheckedOptionsAttr.prototype = Object.create( MinCheckedOptionsAttr.prototype );

	types.push(
		CheckedOptionsNumberAttr,
		MinCheckedOptionsAttr,
		MaxCheckedOptionsAttr,
	);

	return types;
}
