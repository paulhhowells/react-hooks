// Example of use:
// import { Example, ExampleList } from 'contextTypes';
// to make a list of incoming or outgoing [ExampleList.type,  Example.type]
// to make a data object ExampleList.getContextDataObject({name, id, exampleLists})

// Rules for adding a contextType to this file:
// 1. must have `type` and `getContextDataObject` attributes
// 2. if it is a List type:
// 	 a. then it is expected to have a matching singular version,
//   b. to have a 'plural' attribute, e.g. `fdc3.contactList` has the `contacts` attribute, and `fdc3.instrumentList` has `instruments`.
// 3. a contextType may contain an array of things, but not be a list.  e.g. fdc3.portfolio has positions (which correspond to fdc3.positions)

const contextTypes = new Map();

contextTypes.set('Example', {
	type: 'fcd3.example',
	name: String,
	id: {
		ISIN: String,
	},
	getContextDataObject,
});

contextTypes.set('ExampleList', {
	type: 'fcd3.exampleList', // Required
	name: String,
	id: {},
	examples: [], // Required
	positions: Array, // TODO: optionally specify what contextType should be inside?
	data: Array, // optional random stuff
	getContextDataObject,
});

export default contextTypes;

/*
	if type ends in List, then require exampleLists to exist,
	and notice that it is an array
	and props.exampleLists to be an array
	derive its name, unless [] has a string in it, in which case use that instead

	check that items in props have matching type
*/

// props = { name: 'example name', id: { isin: 'example isin' }, another: 'example extra prop' }
function getContextDataObject (props = {}) {
	const contextType = this.type;
	const contextData = {
		type: this.type,
		...build(this, props),
	};

	return contextData;

	function build (schema, props) {
		const listAttributeName = (schema.type.slice(-4) === 'List')
			? deriveListAttributeName(schema.type)
			: false;

		return Object.fromEntries(
			Object.entries(schema)
				.filter(
					([schemaKey]) => (schemaKey !== 'getContextDataObject' && schemaKey !== 'type')
				)
				.map(([schemaKey, schemaValue]) => {
					const prop = props[schemaKey];

					// schemaValue should either be:
					//   a type [Boolean, Number, String], or
					//   an object literal to traverse, or
					//   an array of data or contextTypes
					if (Array.isArray(schemaValue)) {

					}
					if (listAttributeName && schemaKey === listAttributeName) {

					}

					if (isObjectLiteral(schemaValue) && isObjectLiteral(prop)) {
						return [schemaKey, build(schemaValue, prop)];
					}

					// if (typeof prop !== schemaValue) { // If schemaValue is a string.
					// Check that type of prop matches. Expected to be one of [Boolean, Number, String]
					if (prop.constructor !== schemaValue) {
						throw new Error(
							`ContextType: ${contextType}: Expected type to be ${schemaValue} but it is ${typeof prop}`
						);
					}

					return [schemaKey, prop];
				})
		);
	}
}

// TODO: test:
function isObjectLiteral (item) {
	return Boolean(item !== null && item.constructor === Object);
}

// 'fcd3.exampleList' -> 'examples'
function deriveListAttributeName (type) {
	// Remove "List" suffix, and any namespace prefix that ends with a .
	const lastIndexOfDot = type.lastIndexOf('.');
	const sliceStart = (lastIndexOfDot < 0) ? 0 : lastIndexOfDot;
	const attribute = type.slice(sliceStart, -4);

	return pluralise(attribute);
}

// TODO: test:
// dog box fox loss church mash party journey hat cat horse
// buzz hiss watch peach glass wish
function pluralise (word) {
	const lastLetter = word.slice(-1);
	const lastTwoLetters = word.slice(-2);
	let plural = '';

	if (
		lastLetter === 's' || // also handles ss
		lastLetter === 'x' ||
		lastLetter === 'z' ||
		lastTwoLetters === 'ch' ||
		lastTwoLetters === 'sh'
	) {
		plural = word + 'es';
	} else if (lastLetter === 'y' && lastTwoLetters !== 'ey') {
		plural = word.slice(0, -1) + 'ies';
	} else {
		plural = word + 's';
	}

	return plural;
}

// const plural = (
// 	lastLetter === 's' || // also handles ss
// 	lastLetter === 'x' ||
// 	lastLetter === 'z' ||
// 	lastTwoLetters === 'ch' ||
// 	lastTwoLetters === 'sh'
// )
// 	? word + 'es'
// 	: (lastLetter === 'y' && lastTwoLetters !== 'ey')
// 		? word.slice(0, -1) + 'ies'
// 		: word + 's';
