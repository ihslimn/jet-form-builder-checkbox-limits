import {
	CHECKBOX_LIMITS_ENABLED,
	CHECKBOX_LIMITS_MIN,
	CHECKBOX_LIMITS_MAX,
	SUPPORTED_BLOCKS,
	CHECKBOX_LIMITS_MIN_MESSAGE,
	CHECKBOX_LIMITS_MAX_MESSAGE,
	CHECKBOX_LIMITS_BLOCK_OPTIONS,
} from './constants';

function registerAttributes( settings, name ) {

	if ( ! SUPPORTED_BLOCKS[ name ] ) {
		return settings;
	}

	settings.attributes = {
		...settings.attributes,
		[ CHECKBOX_LIMITS_ENABLED ]: {
			type: 'boolean',
			default: false,
		},
		[ CHECKBOX_LIMITS_MIN ]: {
			type: 'string',
			default: '0',
		},
		[ CHECKBOX_LIMITS_MIN_MESSAGE ]: {
			type: 'string',
			default: 'Check at least %this(minCheckedOptions)% options(s)',
		},
		[ CHECKBOX_LIMITS_MAX ]: {
			type: 'string',
			default: '0',
		},
		[ CHECKBOX_LIMITS_BLOCK_OPTIONS ]: {
			type: 'boolean',
			default: false,
		},
		[ CHECKBOX_LIMITS_MAX_MESSAGE ]: {
			type: 'string',
			default: 'Check no more than %this(maxCheckedOptions)% options(s)',
		},
	};

	return settings;
}

export default registerAttributes;
