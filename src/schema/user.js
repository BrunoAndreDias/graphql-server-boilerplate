import {
  gql
} from 'apollo-server-express';

export default gql `
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  type User {
    id: ID!
    username: String!
    email: String!
    messages: [Message!]
  }

  type Token{
    token: String!
  }

  extend type Mutation {
    signUp(username: String!, email: String!, password: String!): Token!
  }
`;