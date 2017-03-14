/**
 * Step 4: Adding placeholders to query, leaving query as literal string
 *
 * Note #1: Only changed the destructuring assignment here
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

	echo({ name }) { //#1
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
query Echo(name: String) {
	echo(name: $name)
}
```

Browser's Fetch API demo
```
// First declare the function fetchData() as in fetchData.js
fetchData(`
query Echo($name: String!) {
	echo(name: $name)
}`, {
	name: 'Hiếu'
})
.then(json => {
	console.log('Response:', JSON.stringify(json));
});

```
*/
