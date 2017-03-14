/**
 * Step 5: Introduce GraphQL scala types: String, Int, Float, Boolean, ID
 * List indicated with []
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
		random: Float!,
		randomRange(fromInt: Int!, toInt: Int!): Int!,
		areYouGay: Boolean!,
		names: [String]!
	}
`);

// The root provides a resolver function for each API endpoint
const root = {
	hello() {
		return 'Hello world!';
	},

	echo({ name }) {
		return `Hello ${name.toUpperCase()}. Greetings from GraphQL Server. Ahihi.`;
	},

	// test Float
	random() {
		return Math.random();
	},

	// test Int
	randomRange({fromInt, toInt}) {
		return fromInt + Math.floor(Math.random() * (toInt - fromInt + 1));
	},

	// test Boolean
	areYouGay() {
		return Math.random() < 0.5;
	},

	// test List of String
	names() {
		return ['Hiếu', 'Quân', 'Khoa', 'Đạt'];
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
  areYouGay,
  random,
  randomRange(fromInt: 1, toInt: 6),
  names,
}
```
*/
