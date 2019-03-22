import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import {
  ApolloServer
} from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, {
  sequelize
} from './models';

const app = express();

app.use(cors());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: error => {
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message
    };
  },
  context: async () => ({
    models,
    me: await models.User.findByLogin('bruno'),
    secret: process.env.SECRET,
  })
});

server.applyMiddleware({
  app,
  path: '/graphql'
});

const eraseDatabaseOnSync = true;

sequelize.sync({
  force: eraseDatabaseOnSync
}).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  app.listen({
    port: 8000
  }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});

const createUsersWithMessages = async () => {
  await models.User.create({
    username: 'bruno',
    email: 'test@a.com',
    password: '123456789',
    messages: [{
      text: 'Learning apollo'
    }]
  }, {
    include: [models.Message]
  });
};