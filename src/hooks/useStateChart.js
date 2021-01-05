import {useReducer} from 'react';

export default function useStateChart ({states={}, initialState, strict=false}) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const transitions = states[state];

	// Add permissible transitions as methods of transition function item:
	Object
		.keys(transitions)
		.forEach(transitionKey => transition[transitionKey] = () => transition(transitionKey));

	return [ state, transition ];

	function transition (transitionTarget) {
		dispatch({ transition: transitionTarget });
	}

	function reducer (state, action) {
		const newState = states[state] && states[state][action.transition];

		if (newState) {
			return newState;
		} else if (strict) {
			throw new Error(`useStateChart ${action.transition} transition not found in ${state} state`);
		}

		return state;
	}
}
