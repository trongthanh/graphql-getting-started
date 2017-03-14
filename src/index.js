/**
 * Step 8: Express middleware; Async resolver
 *
 * #1: 1.1 Request param; 1.2 Middleware
 * #2: Async resolver with Promise
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
		lang: String!,
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
		// #2: Simulate async DB request for Author
		return new Promise((resolve) => {
			setTimeout(() => {
				let rawAuthor = db.authors.find(element => (
					this._authorId === element.id
				));

				resolve(new Author(rawAuthor));
			}, 200);
		});
	}
}


// The root provides a resolver function for each API endpoint
const root = {
	// #1: The request param in resolver
	lang(args, request) {
		return request.query.lang;
	},

	// #2: Async demo, simulate async request for Post
	getPost({ id }) {
		return new Promise((resolve) => {
			setTimeout(() => {
				let rawPost = db.posts.find(element => (id === element.id));

				resolve(new Post(rawPost));
			}, 200);
		});
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
// apply middle ware
app.use(function languageMiddleware(req, res, next) {
	var lang = req.query.lang;
	if (!lang) {
		console.log('No lang defined. Using default lang');
		req.query.lang = 'vi';
	}
	next();
});

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
#1. middleware request
```
{
  lang
}
```

#2. async resolver
```
{
  getPost(id: "01"){
    author {
      firstName,
      lastName
    }
  }
}
```
*/
