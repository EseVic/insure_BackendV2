const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Insure API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'Tiidelab-Fellowship/insure-backend/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `https://insure-8vvy.onrender.com/v1`,
    },
    {
      url: `http://localhost:3000/v1/`
    }
  ],
};

module.exports = swaggerDef;
