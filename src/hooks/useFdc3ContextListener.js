import { useState } from React;

export default function useFdc3ContextListener (contextTypes = []) {
	const [contextState, setContextState] = useState({});

	return contextState;
}

const contextTypes = new Map();
contextTypes.set(ExampleType, 'fcd3.exampleType');

contextTypes.set('fcd3.exampleType', {
	type: 'fcd3.exampleType',
	name: String,
	id: {
		ISIN: String,
	},
	getContextDataObject,
});

// props = { name: 'example name', id: { isin: 'example isin' }, another: 'example extra prop' }
function getContextDataObject (props = {}) {
	const contextType = this.type;
	const contextData = {
		type: this.type,
		...build(this, props),
	};

	return contextData;

	function build (schema, props) {
		return Object.fromEntries(
			Object.entries(schema)
				.filter(([schemaKey]) => (schemaKey !== 'getContextDataObject' && schemaKey !== 'type'))
				.map(([schemaKey, schemaValue]) => {
					const prop = props[schemaKey];

					// schemaValue should either be a type [Boolean, Number, String], or an object literal to traverse
					if (
						schemaValue !== null
						&& schemaValue.constructor === Object
						&& prop !== null
						&& prop.constructor === Object
					) {
						return [schemaKey, build(schemaValue, prop)];
					}

					// if (typeof prop !== schemaValue) { // If schemaValue is a string.
					if (prop.constructor === schemaValue) {
						throw new Error(`ContextType: ${contextType}: Expected type to be ${schemaValue} but it is ${typeof prop}`);
					}

					return [schemaKey, prop];
				})
		);
	}
}

const exampleType = contextTypes.get('exampleType');

// export enum ContextTypes {
//   Contact = 'fdc3.contact',
//   ContactList = 'fdc3.contactList',
//   Country = 'fdc3.country',
//   Instrument = 'fdc3.instrument',
//   Organization = 'fdc3.organization',
//   Portfolio = 'fdc3.portfolio',
//   Position = 'fdc3.position',
// }
