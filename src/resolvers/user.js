import jwt from 'jsonwebtoken';
import {
  AuthenticationError,
  UserInputError
} from 'apollo-server';

export default {
  Query: {
    users: async (parent, args, {
      models
    }) => await models.User.findAll(),
    user: async (parent, {
      id
    }, {
      models,
      me
    }) => await models.User.findById(me.id),
    me: async (parent, args, {
      models,
      me
    }) => {
      if (!me) {
        return null;
      }
      return await models.User.findById(me.id);
    }
  },
  User: {
    messages: async (user, args, {
      models
    }) => await models.Message.findAll({
      where: {
        userId: user.id
      }
    }),
  },
  Mutation: {
    signUp: async (
      parent, {
        username,
        email,
        password
      }, {
        models,
        secret
      },
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });

      return {
        token: createToken(user, secret, '60m')
      };
    },
    signIn: async (parent, {
      login,
      password
    }, {
      models,
      secret
    }) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError(
          'No user found with this login credentials.',
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return {
        token: createToken(user, secret, '60m')
      };
    },
  },
};


const createToken = async (user, secret, expiresIn) => {
  const {
    id,
    email,
    username
  } = user;
  return await jwt.sign({
      id,
      email,
      username
    },
    secret, {
      expiresIn,
    });
};