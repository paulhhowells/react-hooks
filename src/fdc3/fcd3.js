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
	type: 'fcd3.example', // Required
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
	extraData: Array, // optional random stuff
	getContextDataObject,
});

export default contextTypes;

/* TODO: remove this WIP note.
	if type ends in List, then require exampleLists to exist,
	and notice that it is an array
	and data.exampleLists to be an array
	derive its name, unless [] has a string in it, in which case use that instead
	check that items in data have matching type
*/

// data = { name: 'example name', id: { isin: 'example isin' }, another: 'example extra prop' }
function getContextDataObject (data = {}, strict = false) {
	const contextType = this.type;
	const contextData = {
		type: this.type,
		...build(this, data),
	};

	return contextData;

	function build (schema, data) {
		const listAttributeName = (schema.type.slice(-4) === 'List')
			? deriveListAttributeName(schema.type)
			: false;

		// If context type ends in List, then expect data props to have a corresponding a list.
		// e.g. expect `contactList` to have `contacts` property.
		if (listAttributeName && schema[listAttributeName] && (data.hasOwnProperty(listAttributeName) === false)) {
			throw new Error(`ContextType: ${contextType}: ${listAttributeName} not found.`);
		}

		const schemaEntries = Object.entries(schema)
			.filter(
				([schemaKey]) => (schemaKey !== 'getContextDataObject' && schemaKey !== 'type')
			)
			.map(([schemaKey, schemaValue]) => {
				// schemaValue should either be:
				//   a type [Boolean, Number, String], or
				//   an object literal to traverse, or
				//   an array (for data or contextTypes)
				// data prop (datum) should thus be a matching boolean, number, string, object
				//   or an array of data or contextTypes

				const datum = data[schemaKey];

				if (isObjectLiteral(schemaValue) && isObjectLiteral(datum)) {
					return [schemaKey, build(schemaValue, datum)];
				}

				// if (Array.isArray(schemaValue)) {}
				// if (listAttributeName && schemaKey === listAttributeName) {}

				// TODO: is this superfluous? Just use Array instead of [] ?
				// Add a test for the items in the array to have an expected type? Or process items differently?
				// If schemaValue === [] then it is required. Check!
				if (schemaValue === []) {
					if (Array.isArray(datum)) {
						return [schemaKey, datum];
					}

					throw new Error(
						`ContextType: ${contextType}: ${schemaValue} is a required prop, and expected to be an Array.`
					);
				}

				// if (typeof datum !== schemaValue) { // If schemaValue is a string.
				// Check that type of datum matches. Expected to be one of [Boolean, Number, String, Array]
				if (datum.constructor !== schemaValue) {
					throw new Error(
						`ContextType: ${contextType}: Expected type to be ${schemaValue} but it is ${typeof datum}`
					);
				}

				return [schemaKey, datum];
			});

		if (strict) {
			// Then only include data props that match schema.
			return Object.fromEntries(schemaEntries);
		}

		// Add any data props not included in schema.
		const dataEntries = Object.entries(data).filter(
			([datumKey]) => Boolean(schema.hasOwnProperty(datumKey) === false)
		);

		return Object.fromEntries(schemaEntries.concat(dataEntries));
	}
}

// TODO: test:
function isObjectLiteral (item) {
	return Boolean(item !== null && item.constructor === Object);
}

function deriveListAttributeName (type) {
	// e.g. Derives 'examples' from 'fcd3.exampleList'.

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
