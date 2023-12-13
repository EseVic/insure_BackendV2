const express = require('express');
const authRoute = require('./auth.route');
const companyRoute = require('./company.route');
const agentRoute = require('./agent.route')
const dashboardRoute = require('./dashboard')
const claimsRoute = require('./claim')

const docsRoute = require('./docs.route');
const config = require('../../config/config');


const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/company',
    route: companyRoute,
  },

  {
    path: '/agent',
    route: agentRoute,
  },
  {
    path: '/agent',
    route: agentRoute,
  },
  {
    path: '/dash',
    route: dashboardRoute,
  },
  {
    path: '/claim',
    route: claimsRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
