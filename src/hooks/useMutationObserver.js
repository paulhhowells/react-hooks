import { useCallback, useEffect, useState } from 'react';

export default function useMutationObserver(
	targetNodeRef,
	callback,
	config = { attributes: true, childList: true, subtree: true },
) {
	const [result, setResult] = useState();
	const memoizedCallback = useCallback(
		(mutationList, observer) => {
			mutationList.forEach(mutation => {
				setResult(callback(mutation, observer));
			});
		},
		[callback],
	);

	useEffect(
		function initialiseMutationObserver () {
			const observer = new MutationObserver(memoizedCallback);
			observer.observe(targetNodeRef, config);

			return () => observer.disconnect();
		},
		[targetNodeRef, callback],
	);

	return result;
};
