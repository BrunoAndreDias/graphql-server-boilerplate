import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();

app.use(cors());

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};

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
  context: async ({ req }) => {
    const me = await getMe(req);

    return {
      models,
      me,
      secret: process.env.SECRET
    };
  }
});

server.applyMiddleware({
  app,
  path: '/graphql'
});

const eraseDatabaseOnSync = true;

sequelize
  .sync({
    force: eraseDatabaseOnSync
  })
  .then(async () => {
    if (eraseDatabaseOnSync) {
      createUsersWithMessages();
    }

    app.listen(
      {
        port: 8000
      },
      () => {
        console.log('Apollo Server on http://localhost:8000/graphql');
      }
    );
  });

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'bruno',
      email: 'bruno@a.com',
      password: '123456789',
      role: 'ADMIN',
      messages: [
        {
          text: 'Learning apollo'
        }
      ]
    },
    {
      include: [models.Message]
    }
  );
  await models.User.create(
    {
      username: 'test',
      email: 'test@a.com',
      password: '123456789',
      messages: [
        {
          text: 'Happy to release ...'
        },
        {
          text: 'Published a complete ...'
        }
      ]
    },
    {
      include: [models.Message]
    }
  );
};
