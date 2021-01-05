import React from 'react';
import useStateChart from '../hooks/useStateChart';

const stateChartConfig = {
	initialState: 'STATE_1',
	states: {
		STATE_1: {
			A: 'STATE_2',
			B: 'STATE_3',
			C: 'STATE_3',
		},
		STATE_2: {
			A: 'STATE_3',
			B: 'STATE_1',
			C: 'STATE_3',
		},
		STATE_3: {
			A: 'STATE_1',
			B: 'STATE_2',
		}
	}
}

function StateChart () {
	const [state, transition] = useStateChart(stateChartConfig);

	return (
		<section className="state-chart">
			<h1>State Chart</h1>
			<div>
				state: { state }
			</div>
			<div>
				{ Object.keys(transition).length } transitions available:
				{ Object.keys(transition).map(key => ` ${key} `) }
			</div>

			<button onClick={() => transition('A')} type="button">A &gt;</button>
			<button onClick={() => transition.B()} type="button">B &lt;</button>
			<button onClick={() => transition('C')} type="button">C #</button>
		</section>
	);
}

export default StateChart;
