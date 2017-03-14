/**
 * Fetch data example with fetch API
 */
/*eslint no-unused-vars:0*/

function fetchData(query = '{ hello }', url = 'http://localhost:3000/graphql') {
	let requiredHeaders = new Headers({
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	});

	let req = new Request(url, {
		method: 'POST',
		headers: requiredHeaders,
		body: JSON.stringify({ query })
	});

	// return a promise which resolves with a json result object
	return fetch(req).then(response => {
		console.log('response.status:', response.status);
		if (response.ok) {
			return response.json(); // result will be JSON object
		} else {
			return null; // OR null
		}
	}).catch(err => {
		console.log('Errors:', err);
		return err;
	});
}
