const { db } = require("../models");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
require("dotenv").config();
const { emailService } = require('../services');

const axios = require("axios");
const generator = require("generate-password");
const { email } = require("../config/config");



exports.authController = {
  reg: async (req, res) => {
    const type = req.query.type;
    console.log(type)
    let verifyToken = "";
    let emaildata = {};
    switch (type) {
      case "company":
        const user = req.body;
        console.log(user)
        if (!req.body || !req.body.email) {
          res.status(400).send({
            status: false,
            message: "error",
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
                message: "This Email is taken",
              });
            } else if (data && !data.isEmailVerified) {

              verifyToken = generator.generate({
                length: 5,
                numbers: true,
              });
              await db.users.update(verifyToken, { where: { id: data.id } })
              console.log(data.email)
              await emailService.sendEmail({
                to: [data.email.toString()],
                subject: "Verify your account",
                text: `Dear user, 
                             @ Thanks for signing up to INsure!
                       Your verification pin is: ${verifyToken} `,

              }

              );

              res.status(200).send({
                status: true,
                message: "Token sent to mail",
                // newData,
              });
            } else {
              if (user.password) {
                user.password = bcrypt.hashSync(user.password, 10);
              } else {
                user.password = bcrypt.hashSync(user.companyName, 10);
              }
              user.userType = "company";
              verifyToken = generator.generate({
                length: 5,
                numbers: true,
              });
              user.verifyToken = verifyToken;
              db.users
                .create(user)
                .then(async (data1) => {
                  await db.company.create({ ...user, userId: data1.id })
                  await emailService.sendEmail(
                    {
                      to: data1.email.toString(),
                      subject: "Verify your account",
                      text: `Dear user, 
                                    @ Thanks for signing up to INsure!
                              Your verification pin is: ${verifyToken} `,


                    }


                  )
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
                    message: "Token sent to mail",
                    data: respayload,
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
      case "agent":
        const agentData = req.body;
        if (!req.body || !req.body.email) {
          res.status(400).send({
            status: false,
            message: "error",
          });
        }
        db.users
          .findOne({
            where: {
              email: agentData.email,
            },
          })
          .then(async (data) => {
            if (data && data.isEmailVerified) {
              res.status(400).send({
                status: false,
                message: "This Email is taken",
              });
            } else if (data && !data.isEmailVerified) {
              const companyData = await db.company.findOne({ where: { id: agentData.companyProfileId } })
              verifyToken = generator.generate({
                length: 5,
                numbers: true,
              });
              await emailService.sendEmail({
                to: [data.email.toString()],
                subject: "Verify your account",
                text: `Dear user,
                        @ ${companyData.companyName} just invited you to INsure! 
                        Please click on this link () to setup your accoun.
                         `,


              });
              delete data.password;
              delete data.verifyToken;

              res.status(200).send({
                status: true,
                message: "Token sent to mail",
                data,
              });
            } else {
              if (agentData.password) {
                agentData.password = bcrypt.hashSync(agentData.password, 10);
              } else {
                agentData.password = bcrypt.hashSync(
                  agentData.firstName,
                  10
                );
              }
              verifyToken = generator.generate({
                length: 5,
                numbers: true,
              });
              agentData.verifyToken = verifyToken;
              agentData.role = "agent";
              db.users
                .create(agentData)
                .then(async (data1) => {
                  console.log(data1)
                  await db.agent.create({ ...agentData, userId: data1.id })
                  await emailService.sendEmail({
                    to: [data1.email.toString()],
                    subject: "Verify your account",
                    text: `Dear user,
                        @ ${companyData.companyName} just invited you to INsure! 
                        Please click on this link (https://insure-personal-git-alice-home-alice2212.vercel.app/auth/admin/registration/setup) to setup your account
                         `,


                  });
                  delete data1.password;
                  delete data1.verifyToken;
                  const respayload = {
                    id: data1.id,
                    cooperativeName: data1.cooperativeName,
                    email: data1.email,
                    phoneNumber: data1.phoneNumber,
                  };
                  res.status(200).send({
                    status: true,
                    message: "Token sent to mail",
                    data: respayload,
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
        return res
          .status(400)
          .send({ message: "No type for user", status: false });
    }
  },

  verifyAccount: async (req, res) => {
    const type = req.query.type;

    switch (type) {
      case "company":
        try {
          // const { userId } = req.decodedData;
          const user = await db.users.findOne({
            where: {
              email: req.body.email,
            },
          });
          if (user.verifyToken !== req.body.verifyToken) {
            res
              .status(400)
              .send({ status: false, message: "Verify account error" });
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
                message: "Verify account error",
              });
            }

            res.status(200).send({
              status: true,
              message: "Successfully verified your account",
            });
          }
        } catch (error) {
          res.status(400).send({
            status: false,
            message: error?.message ?? "Verify account error",
          });
        }
        break;
      case "agent":
        try {
          // const { userId } = req.decodedData;
          const agentData = await db.agent.findOne({
            where: {
              email: req.body.email,
            },
          });
          if (agentData.verifyToken !== req.body.verifyToken) {
            res
              .status(400)
              .send({ status: false, message: "Verify account error" });
          } else {
            const updatedUser = await db.agent.update(
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
                message: "Verify account error",
              });
            }

            res.status(200).send({
              status: true,
              message: "Successfully verified your account",
            });
          }
        } catch (error) {
          res.status(400).send({
            status: false,
            message: error?.message ?? "Verify account error",
          });
        }
        break;
      default:
        return res
          .status(400)
          .send({ message: "No type for user", status: false });
    }
  },
  
  signin: async (req, res) => {
    const type = req.query.type;

    switch (type) {
      case "company":
        try {
          const user = await db.users.findOne({
            where: { email: req.body.email },
            include: [{ model: db.company, as: "companyProfile" }],
          });
          // if record doesn't exist
          if (!user) {
            return res.status(404).send({
              status: false,
              message: "Invalid username or password",
            });
          }

          if (!user.isEmailVerified) {
            return res.status(404).send({
              status: false,
              message: "verify account first",
            });
          }

          // compare the request password with the hashed password saved in the database
          let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );

          // // if password is not valid
          if (!passwordIsValid) {
            return res.status(404).send({
              accessToken: null,
              message: "Invalid username or password",
              status: false,
            });
          }
          delete user.password;
          delete user.verifyToken;

          let payload = {
            userId: user.id,
            userType: user.userType,
          };

          
          res.status(200).send({
            status: true,
            data: user,
            // accessToken: token,
            message: "successfully logged in",
          });
        } catch (err) {
          res.status(400).send({
            status: false,
            message: "Could not fetch record" + err,
          });
        }

        break;
      case "agent":
        await db.users.findOne({
          where: { email: req.body.email },
          include: [{ model: db.company, as: "agent" }],
        })
          .then((agentData) => {
            // if record doesn't exist
            if (!agentData) {
              return res.status(404).send({
                message: "Invalid username or password",
              });
            }
            if (!agentData.isEmailVerified) {
              return res.status(404).send({
                status: false,
                message: " verify account first",
              });
            }
            // compare the request password with the hashed password saved in the database
            let passwordIsValid = bcrypt.compareSync(
              req.body.password,
              agentData.password
            );

            // if password is not valid
            if (!passwordIsValid) {
              return res.status(404).send({
                accessToken: null,
                message: "Invalid username or password",
              });
            }

            let payload = {
              agentId: agentData.id,
              userType: agentData.userType,
            };
            delete agentData.password;
            delete agentData.verifyToken;
          


            res.status(200).send({
              status: true,
              data: agentData,
              // accessToken: token,
              message: "successfully logged in",
            });
          })
          .catch((err) => {
            res.status(400).send({
              status: false,
              message: "Could not fetch record",
            });
          });
        break;
      default:
        return res
          .status(400)
          .send({ message: "No type for user", status: false });
    }
  },
}