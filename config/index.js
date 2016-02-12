const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {

  // environment
  __DEV__: NODE_ENV === 'development',
  __PROD__: NODE_ENV === 'production',

  // server configuration
  SERVER_PORT: process.env.PORT || 9000,

  JWT: {
    unless: {
      path: ['/api', '/api/user/login', '/api/user/create']
    },
    secret: 'ilovekiki', // TODO: Should I crypt it?
  },
};
