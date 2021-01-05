import React from 'react';
import useLogicTable from '../hooks/useLogicTable';

const config = {
	inputs: ['x', 'y', 'z'],
	table: [
		//      XYZ
		'A', // 000
		'B', // 001
		'C', // 010
		'D', // 011
		'E', // 100
		'F', // 101
		'G', // 110
		'H', // 111
	],
};

function LogicTable() {
	const [state, input01, input02, input03] = useLogicTable(config);

	return (
		<section className="logic-table">
			<h1>Logic Table</h1>
			<div>
				{ state }
			</div>
			<div>
				<button onClick={() => input01(true)} type="button">01 true</button>
				<button onClick={() => input01(false)} type="button">01 false</button>

				<button onClick={() => input02(true)} type="button">02 true</button>
				<button onClick={() => input02(false)} type="button">02 false</button>

				<button onClick={() => input03(true)} type="button">03 true</button>
				<button onClick={() => input03(false)} type="button">03 false</button>
			</div>
			<div>
				<button onClick={() => input01.toggle()} type="button">01 toggle</button>
				<button onClick={() => input02.toggle()} type="button">02 toggle</button>
				<button onClick={() => input03.toggle()} type="button">03 toggle</button>
			</div>
		</section>
	);
}

export default LogicTable;
