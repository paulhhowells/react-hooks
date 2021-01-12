import { useEffect, useState } from 'react';

export default function useFdc3ContextListener (
	fdc3,
	selectedChannelId,
	contextTypes = [],
) {
	const [fdc3Context, setFdc3Context] = useState({});

	// Join channel to listen on, and gather previously sent context data.
	useEffect(function joinChannelAndGather () {
		fdc3.joinChannel(selectedChannelId);
		fdc3
			.getCurrentChannel()
			.then(updateEachContextType);

		function updateEachContextType (channel) {
			contextTypes.forEach(contextType => {
				channel
					.getCurrentContext(contextType)
					.then(channelContextData => {
						if (channelContextData !== null && channelContextData !== undefined) {
							const { type, ...rest } = channelContextData;

							updateFdc3ContextData(type, rest);
				}
			});
			});
		}
	}, [fdc3, selectedChannelId, contextTypes]);

	// Listen for broadcast FDC3 context messages.
	useEffect(function listenToBroadcast () {

		// FDC3 Doc: https://github.com/finos/FDC3/blob/master/docs/api/ref/Channel.md#addcontextlistener
		const { unsubscribe } = fdc3.addContextListener(receivedContextMessage => {
			const { type, ...rest } = receivedContextMessage;

			// Only update context types that are being listened for.
			if (contextTypes.indexOf(type) >= 0) {
				updateFdc3ContextData(type, rest);
			}
		});

		return () => unsubscribe;
	}, [fdc3, contextTypes]);

	function updateFdc3ContextData (type, contextData) {
		setFdc3Context(previousContextData => ({
			...previousContextData,
			[type]: { ...contextData },
		}));
	}

	return [fdc3Context, setFdc3Context];
}


const contextTypes = new Map();
contextTypes.set('ExampleType', 'fcd3.exampleType');

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
