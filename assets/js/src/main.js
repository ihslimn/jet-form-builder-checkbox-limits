import registerAttributes from './attributes';
import './controls';

const {
	      addFilter,
      } = wp.hooks;

addFilter(
	'blocks.registerBlockType',
	'jfb-checkbox-limits/block-attributes',
	registerAttributes,
);
