import {
	useMemo,
	useReducer,
} from 'react';

/*
	Example config signature:
	{
		inputs: ['A', 'B'],
		table: [
					 // AB
			'W', // 00
			'X', // 01
			'Y', // 10
			'Z', // 11
		],
	}
	Each input operand is a binary bit, [1 | 0] [true | false].

	// TODO: consider using a binary number and bit setting.
*/

export default function useLogicTable ({inputs, table}) {
	const [{result}, dispatch] = useReducer(reducer, {
		bits: inputs.map(() => 0),
		result: table[0]
	});

	const controls = useMemo(
		() => inputs.map((input, index) => {
			// (value) expected to be boolean or 1 or 0. But also handle truthy / falsey values.
			const setOperand = (value) => dispatch({ input, index, value });
			setOperand.toggle = () => dispatch({ input, index });

			return setOperand;
		}),
		[inputs]
	);

	// Controls map from left to right, setting from the MSB to the LSB.
	// i.e. first control function sets the MSB input.
	return [ result, ...controls ];

	function reducer (state, action) {
		const index = action.index;
		const bits = [...state.bits];

		// If action has a value then set it, else toggle stored value:
		bits[index] = (action.hasOwnProperty('value'))
			? Number(Boolean(action.value)) // Set the operand bit as a binary number.
			: 1 - bits[index] // Toggle the binary number. 0 -> 1, 1 -> 0.

		const binary = bits.join('');
		const tableIndex = parseInt(binary, 2);

		return {
			bits,
			result: table[tableIndex]
		};
	}
}
