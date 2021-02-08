import { useCallback, useEffect, useRef, useState } from 'react';

const defaultConfig = { method: 'GET' };

export const fetchData = async (url, config, options={}) => {
	console.log('REACT_APP_API_BASE_URL', process.env.REACT_APP_API_BASE_URL);

	return window
		.fetch(url, config)
		.then(async response => {
			try {
				// responseMethod options include: json() text() formData() blob() arrayBuffer().
				const responseMethod = options.responseMethod || 'json';
				const data = await response[responseMethod]();

				if (response.ok) {
					return data;
				} else {
					// response.statusText not in 200-299, but could be in a useful 300 range.
					return Promise.reject(response);
				}
			} catch (error) {
				return Promise.reject(new Error(error));
			}
		});
};

export default function useFetch({url, config = defaultConfig, interval, options={}}) {
	const timeout = useRef();
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true); // set true here?
	const getData = useCallback(() => {
		setLoading(true);

		fetchData(url, config, options) // process.env.REACT_APP_API_BASE_URL + url
			.then((data) => setData(data))
			.catch((error) => {
				console.error(error);

				setError(error);
			})
			.finally(() => {
				setLoading(false);

				if (interval) {
					clearTimeout(timeout.current);
					timeout.current = setTimeout(() => getData(), interval);
				}
			});
	}, [url, config, interval, options]);

	useEffect(() => {
		getData();

		return () => clearTimeout(timeout.current);
	}, [url, config, getData]);

	return { data, loading, error };
}
