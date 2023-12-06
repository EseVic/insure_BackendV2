const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { db } = require('../models');

/**
 * Verify the callback function.
 *
 * @param {Object} req - The request object.
 * @param {Function} resolve - The resolve function.
 * @param {Function} reject - The reject function.
 * @param {Array} requiredRights - An array of required rights.
 * @return {Promise} Resolves if the callback is verified.
 */
const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

  req.user = user;
  const userInfo = await db.users.findByPk(user.id);

  if (requiredRights.length) {
    const userRights = roleRights.get(userInfo.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

/**
 * Generate a higher-order function that performs authentication based on the required rights.
 *
 * @param {...string} requiredRights - The required rights for authentication.
 * @return {Function} The middleware function that performs the authentication.
 */
const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
