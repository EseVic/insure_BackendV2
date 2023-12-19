const { db } = require('../models');
const bcrypt = require('bcryptjs');
const generator = require('generate-password');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');

const register = catchAsync(async (req, res) => {
  const type = req.query.type;
  // console.log(type)
  let verifyToken = '';
  // let emaildata = {};
  switch (type) {
    case 'company':
      const user = req.body;
      // console.log(user);
      if (!req.body || !req.body.email) {
        res.status(400).send({
          status: false,
          message: 'All field required',
        });
      }
      db.users
        .findOne({
          where: {
            email: user.email,
          },
        })
        .then(async (data) => {
          if (data && data.isEmailVerified) {
            res.status(404).send({
              status: false,
              message: 'This Email is taken',
            });
          } else if (data && !data.isEmailVerified) {
            verifyToken = generator.generate({
              length: 5,
              numbers: true,
            });
            
            const to = [data.email.toString()];
            const subject = 'Verify your account';
            const text = `Dear user, 
                Thanks for signing up to INsure! Your verification pin is: ${verifyToken}`;
            await emailService.sendEmail(to, subject, text);
            await db.users.update({verifyToken: verifyToken}, { where: { id: data.id } });

            res.status(200).send({
              status: true,
              message: 'Token sent to mail',
              data

            
            });
          } else {
            if (user.password) {
              user.password = bcrypt.hashSync(user.password, 10);
            } else {
              user.password = bcrypt.hashSync(user.companyName, 10);
            }

            //token verification
            user.userType = 'company';
            verifyToken = generator.generate({
              length: 5,
              numbers: true,
            });
            user.verifyToken = verifyToken;
            db.users
              .create(user)
              .then(async (data1) => {
                await db.company.create({ ...user, userId: data1.id });
                const to = [data1.email.toString()];
                const subject = 'Verify your account';
                const text = `Dear user,
                Thanks for signing up to INsure! Your verification pin is: ${verifyToken}`;
                await emailService.sendEmail(to, subject, text);
                delete data1.password;
                delete data1.verifyToken;
                const respayload = {
                  id: data1.id,
                  firstName: data1.firstName,
                  lastName: data1.lastName,
                  email: data1.email,
                  phoneNumber: data1.phoneNumber,
                };

                res.status(200).send({
                  status: true,
                  message: 'Token sent to mail',
                  data: respayload,
                });
              })
              .catch((error) => {
                console.log(error);
                res.status(400).send({
                  status: false,
                  message: error.message,
                });
              });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(400).send({
            status: false,
            message: error.message,
          });
        });
      break;
    case 'agent':
      const agentData = req.body;
      if (!req.body || !req.body.email) {
        res.status(400).send({
          status: false,
          message: 'error',
        });
      }
      db.users
        .findOne({
          where: {
            email: agentData.email,
          },
        })
        .then(async (data) => {
          const agentInfo = await db.agent.findOne({
            where: {
              email: agentData.email,
            },
          });
          if (data && data.isEmailVerified && agentInfo.firstName && agentInfo.lastName) {
            res.status(400).send({
              status: false,
              message: 'This Email is taken',
            });
          } else if (data && !data.isEmailVerified && agentInfo.firstName && agentInfo.lastName) {
            verifyToken = generator.generate({
              length: 5,
              numbers: true,
            });
            const to = [data.email.toString()];
            const subject = 'Verify your account';
            const text = `Dear user,
                Your verification pin is ${verifyToken}`;
            await emailService.sendEmail(to, subject, text);
            await db.users(verifyToken, {where: {id: data.id}})
            // delete data.password;
            // delete data.verifyToken;

            res.status(200).send({
              status: true,
              message: 'Token sent to mail',
              data,
            });
          } else if (
            data &&
            !data.isEmailVerified &&
            !agentInfo.firstName &&
            !agentInfo.lastName &&
            agentData.firstName &&
            agentData.lastName
          ) {
            await db.agent.update(
              { ...agentData, userId: data.id },
              {
                where: {
                  id: agentInfo.id,
                },
              }
            );
            // console.log(data.id)
              agentData.password = bcrypt.hashSync(agentData.password, 10);
            await db.users.update(
              { phoneNumber: agentData.phoneNumber, password: agentData.password },
              {
                where: {
                  id: data.id,
                },
              }
            );
            // verifyToken = generator.generate({
            //   length: 5,
            //   numbers: true,
            // });
            // const to = [data.email.toString()];
            // const subject = 'Verify your account';
            // const text = `Dear user,
            //     Your verification pin is ${verifyToken}`;
            // await emailService.sendEmail(to, subject, text);
            // await db.users(verifyToken, {where: {id: data.id}})
            delete data.password;
            delete data.verifyToken;

            res.status(200).send({
              status: true,
              message: 'Token sent to mail',
              data,
            });
          } else {
            const companyData = await db.company.findOne({ where: { id: agentData.companyProfileId } });
            console.log(agentData)
            if (agentData.password) {
              agentData.password = bcrypt.hashSync(agentData.password, 10);
            } else {
              agentData.password = bcrypt.hashSync(agentData.email, 10);
            }
            verifyToken = generator.generate({
              length: 5,
              numbers: true,
            });
            agentData.verifyToken = verifyToken;
            agentData.role = 'agent';
            console.log(agentData)
            db.users
              .create(agentData)
              .then(async (data1) => {
                console.log(data1);
                await db.agent.create({ ...agentData, userId: data1.id });
                const emailData = {
                  to: [data1.email.toString()],
                  subject: 'Signup as an agent on INsure',
                  text: `Dear agent,
              ${companyData.companyName} just invited you to INsure! Please visit this https://insure-personal-git-alice-home-alice2212.vercel.app/auth/agent/registration to setup your account. 
                Your verification pin is ${verifyToken}.`
                };
                await emailService.sendEmail(emailData.to, emailData.subject, emailData.text);
                delete data1.password;
                delete data1.verifyToken;
                // const respayload = {
                //   id: data1.id,
                //   cooperativeName: data1.cooperativeName,
                //   email: data1.email,
                //   phoneNumber: data1.phoneNumber,
                // };
                const user =data1.dataValues
                res.status(200).send({
                  status: true,
                  message: 'Token sent to mail',
                  // data: {
                  //   ...data1,
                  //   companyProfileId: companyData.id,
                  // },                 
                  data:{...user, companyProfileId: companyData}
                });
              })
              .catch((error) => {
                res.status(400).send({
                  status: false,
                  message: error.message,
                });
              });
          }
        })
        .catch((error) => {
          res.status(400).send({
            status: false,
            message: error.message,
          });
        });
      break;
    default:
      return res.status(400).send({ message: 'No type for user', status: false });
  }
});

const login = catchAsync(async (req, res) => {
  const type = req.query.type;

  switch (type) {
    case 'company':
      try {
        const user = await db.users.findOne({
          where: { email: req.body.email },
          include: [{ model: db.company, as: 'companyProfile' }],
        });
        // if record doesn't exist
        if (!user) {
          return res.status(404).send({
            status: false,
            message: 'Invalid username or password',
          });
        }

        if (!user.isEmailVerified) {
          return res.status(404).send({
            status: false,
            message: 'verify account first',
          });
        }

        // compare the request password with the hashed password saved in the database
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        // // if password is not valid
        if (!passwordIsValid) {
          return res.status(404).send({
            accessToken: null,
            message: 'Invalid username or password',
            status: false,
          });
        }
        delete user.password;
        delete user.verifyToken;

        let payload = {
          userId: user.id,
          userType: user.userType,
        };
        const tokens = await tokenService.generateAuthTokens(user.id);
        res.status(200).send({
          status: true,
          data: { user, tokens },
          // accessToken: token,
          message: 'successfully logged in',
        });
      } catch (err) {
        res.status(400).send({
          status: false,
          message: 'Could not fetch record' + err,
        });
      }

      break;
    case 'agent':
      await db.users
        .findOne({
          where: { email: req.body.email },
          include: [{ model: db.agent, as: 'agent' }],
        })
        .then((agentData) => {
          // if record doesn't exist
          console.log(agentData)
          if (!agentData) {
            return res.status(404).send({
              message: 'Invalid username or password',
            });
          }
          if (!agentData.isEmailVerified) {
            return res.status(404).send({
              status: false,
              message: ' verify account first',
            });
          }
          // compare the request password with the hashed password saved in the database
          let passwordIsValid = bcrypt.compareSync(req.body.password, agentData.password);
          console.log(passwordIsValid)
          // if password is not valid
          if (!passwordIsValid) {
            return res.status(404).send({
              accessToken: null,
              message: 'Invalid username or password',
            });
          }

          let payload = {
            agentId: agentData.id,
            userType: agentData.userType,
          };
          delete agentData.password;
          delete agentData.verifyToken;

          const tokens = tokenService.generateAuthTokens(agentData.id);

          res.status(200).send({
            status: true,
            data: { agentData, tokens },
            // accessToken: token,
            message: 'successfully logged in',
          });
        })
        .catch((err) => {
          res.status(400).send({
            status: false,
            message: 'Could not fetch record' + err,
          });
        });
      break;
    default:
      return res.status(400).send({ message: 'No type for user', status: false });
  }
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.OK).send('logged out successfully!');
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  // res.status(httpStatus.NO_CONTENT).send();

  const role = req.query.type || 'unknown'; // Adjust 'unknown' as needed
  console.log(role)
  res.status(httpStatus.NO_CONTENT).json({ status: 'success', role });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  // res.status(httpStatus.NO_CONTENT).send();

  // const role = req.query.type || 'unknown'; // Adjust 'unknown' as needed
  // console.log(role)
  // res.status(httpStatus.NO_CONTENT).json({ status: 'success', role });
});

const verifyEmail = catchAsync(async (req, res) => {
  const type = req.query.type;

  switch (type) {
    case 'company':
      try {
        // const { userId } = req.decodedData;
        const user = await db.users.findOne({
          where: {
            email: req.body.email,
            role: req.query.type,
          },
        });
        console.log(req.query.type)
        console.log(user)
        if (user.verifyToken !== req.body.verifyToken) {
          res.status(400).send({ status: false, message: 'Verify account error' });
        } else {
          const updatedUser = await db.users.update(
            { isEmailVerified: true },
            {
              where: {
                id: user.id,
              },
            }
          );
          if (!updatedUser) {
            res.status(400).send({
              status: false,
              message: 'Verify account error',
            });
          }

          res.status(200).send({
            status: true,
            message: 'Successfully verified your account',
          });
        }
      } catch (error) {
        res.status(400).send({
          status: false,
          message: error.message || 'Verify account error',
        });
      }
      break;
    case 'agent':
      try {
        // const { userId } = req.decodedData;
        const agentData = await db.users.findOne({
          where: {
            email: req.body.email,
            role: req.query.type,
          },
        });
        if (agentData.verifyToken !== req.body.verifyToken) {
          res.status(400).send({ status: false, message: 'Verify account error' });
        } else {
          const updatedUser = await db.users.update(
            { isEmailVerified: true },
            {
              where: {
                id: agentData.id,
              },
            }
          );
          if (!updatedUser) {
            res.status(400).send({
              status: false,
              message: 'Verify account error',
            });
          }

          res.status(200).send({
            status: true,
            message: 'Successfully verified your account',
          });
        }
      } catch (error) {
        res.status(400).send({
          status: false,
          message: error.message || 'Verify account error',
        });
      }
      break;
    default:
      return res.status(400).send({ message: 'No type for user', status: false });
  }
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
