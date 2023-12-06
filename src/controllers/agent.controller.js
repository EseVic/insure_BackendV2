const httpStatus = require('http-status');
// const pick = require('../utils/pick');
// const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tokenService, userService, agentService } = require('../services');

const agentRegister = catchAsync(async (req, res) => {
  const user = await userService.createUser('agent', req.body);
	const agent = await agentService.createAgent(user.id, req.body)
  const tokens = await tokenService.generateAuthTokens(user.dataValues.id);
  res.status(httpStatus.CREATED).send({
    message: 'registration successful',
    user: {
      ...user,
      ...agent,
      tokens,
    },
  });
});

module.exports = {
  agentRegister,
};