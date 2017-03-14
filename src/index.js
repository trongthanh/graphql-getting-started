/**
 * Step 6: Introduce custom types
 *
 */
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const express = require('express');

const db = require('./data'); //import mock data

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
	type Post {
		id: ID!,
		author: String!,
		content: String!,
		timestamp: Float,
	}

	type Query {
		getPost(id: ID!): Post,
		getPosts(limit: Int): [Post],
	}
`);

// The root provides a resolver function for each API endpoint
const root = {
	getPost({ id }) {
		return db.posts.find(element => (id === element.id));
	},

	getPosts({ limit }) {
		if (limit != null) {
			return db.posts.slice(0, limit);
		} else {
			return db.posts;
		}
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
  getPosts(limit: 2){
    author,
	timestamp,
  },
  getPost(id: "04"){
    id,
    author,
    content,
  }
}
```
*/
