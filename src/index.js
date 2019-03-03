import express from 'express';
import {
    ApolloServer,
    gql
} from 'apollo-server-express';
import cors from 'cors';

const app = express();
app.use(cors());

const schema = gql `
  type Query {
      users: [User!]
    me: User
    user (id: ID!): User
  }

  type User {
      id: ID!
      username: String!
  }
`;

let users = {
    1: {
        id: '1',
        username: 'Robin Wieruch',
    },
    2: {
        id: '2',
        username: 'Dave Davids',
    },
}
const me = users[1];

const resolvers = {
    Query: {
        users: () => Object.values(users),
        me: () => me,
        user: (parent, {
            id
        }) => users[id],
    },
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
});

server.applyMiddleware({
    app,
    path: '/graphql'
});

app.listen({
    port: 8000
}, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
});