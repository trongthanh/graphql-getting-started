/**
 * Step 7: Demonstrate nested object fields and
 * implement resolvers with ES6 classes
 *
 * Note #1: We use class method to resolve nested object
 */
const { buildSchema } = require('graphql');
const graphqlHTTP = require('express-graphql');
const express = require('express');

const db = require('./data'); //import mock data

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
	type Author {
		id: ID!,
		firstName: String,
		lastName: String,
		age: Int,
	}

	type Post {
		id: ID!,
		author: Author,
		content: String!,
		timestamp: Float,
	}

	type Query {
		getPost(id: ID!): Post,
		getPosts(limit: Int): [Post],
		getAuthor(id: ID!): Author,
		getAuthors: [Author],
	}
`);

class Author {
	constructor(raw) {
		Object.assign(this, raw);
	}
}

class Post {
	constructor(raw) {
		this.id = raw.id;
		this.content = raw.content;
		this._authorId = raw.author; //raw field is just an ID string
		this.timestamp = raw.timestamp;
	}

	// This method to resolve complicated custom field type
	author() {
		return new Author(db.authors.find(element => (
			this._authorId === element.id
		)));
	}
}


// The root provides a resolver function for each API endpoint
const root = {
	getPost({ id }) {
		return new Post(
			db.posts.find(element => (id === element.id))
		);
	},

	getPosts({ limit }) {
		if (limit != null) {
			return db.posts.slice(0, limit).map(post => new Post(post));
		} else {
			return db.posts.map(post => new Post(post));
		}
	},

	getAuthor({ id }) {
		return new Author(
			db.authors.find(element => (id === element.id))
		);
	},

	getAuthors() {
		return db.authors.map(author => new Author(author));
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
  getPost(id: "03"){
    id,
    author {
      id,
      firstName,
      lastName
    },
    content,
    timestamp
  }
}
```
*/
