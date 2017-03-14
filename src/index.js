/**
 * Step 9: Mutation and input
 *
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

	input PostInput {
		author: ID!,
		content: String!,
	}

	type Mutation {
		createPost(input: PostInput): Post
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

function createRawPost(input) {
	return {
		id: String(db.posts.length),
		content: input.content,
		author: input.author,
		timestamp: Date.now(),
	};
}

// The root provides a resolver function for each API endpoint
const root = {
	lang(args, request) {
		return request.query.lang;
	},

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
	},

	createPost({ input }) {
		let newPost = createRawPost(input);
		db.posts.push(newPost);
		return new Post(newPost);
	},
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
#1. Without variables
```
mutation {
  createPost(input: {
    author: "01",
    content: "Hắn vừa đi vừa chửi. Bao giờ cũng thế, cứ rượu xong là hắn chửi. Bắt đầu hắn chửi trời. Có hề gì? Trời có của riêng nhà nào? Rồi hắn chửi đời. Thế cũng chẳng sao: đời là tất cả nhưng chẳng là ai. Tức mình, hắn chửi ngay tất cả làng Vũ Đại. Nhưng cả làng Vũ Đại ai cũng nhủ: “Chắc nó trừ mình ra!”."
  }) {
    id,
    author
  }
}
```
#2. With variables
mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    id,
    author
  }
}

"variables": {
  "input": {
    "author": "02",
    "content": "Hello Graph QL. Ahihi"
  }
}
*/
