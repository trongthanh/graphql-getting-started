/**
 * Step 3: Implement query parameters, passing arguments to resolver
 *
 */
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const express = require('express');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
	type Query {
		hello: String,
		echo(name: String!): String,
	}
`);

// The root provides a resolver function for each API endpoint
const root = {
	hello() {
		return 'Hello world!';
	},

	echo(args) {
		let name = args.name;
		return `Hello ${name.toUpperCase()}. Greetings from GraphQL Server. Ahihi.`;
	}
};

let app = express();
// define the API endpoint
app.use('/graphql', graphqlHTTP({
	schema,
	rootValue: root,
	graphiql: true, // enable graphiql's query editor
}));
app.listen(3000);

console.log('Running a GraphQL API server at localhost:3000/graphql');

/*
Query to try in GraphiQL:
```
{
	echo(name: 'Hiếu')
}
```

Browser's Fetch API demo
```
// First declare the function fetchData() as in fetchData.js
fetchData(`{
	echo(name: "Hiếu")
}`).then(json => {
	console.log('Result:', JSON.stringify(json));
});

```
*/
