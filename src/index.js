/**
 * Step 2: Add express and express-graphql to allows previewing with GraphiQL
 * and test fetching from from browser
 */
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const express = require('express');

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
	type Query {
		hello: String
	}
`);

// The root provides a resolver function for each API endpoint
const root = {
	hello() {
		return 'Hello world!';
	},
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
	hello
}
```
*/
