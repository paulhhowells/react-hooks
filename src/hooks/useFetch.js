import { useState, useEffect } from 'react';

const defaultConfig = { method: 'GET' };

export const useFetch = (url, config = defaultConfig) => {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!url) {
			return;
		}

		const fetchData = async () => {
			setLoading(true);

			return window
				.fetch(url, config)
				.then(async response => {
					try {
						const data = await response.json();

						if (response.ok) {
							return data;
						} else {
							return Promise.reject(data);
						}
					} catch (error) {
						return Promise.reject(error);
					}
				});
		};

		fetchData()
			.then(
				data => setData(data),
				error => console.error('oh no, login failed', error)
			)
			.finally(() => setLoading(false));
	}, [url, config]);

	return {data, loading};
};
