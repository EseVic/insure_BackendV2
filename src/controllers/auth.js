const { db } = require("../models");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
require("dotenv").config();
const { emailService } = require('../services');

const axios = require("axios");
const generator = require("generate-password");



exports.authController = {
    reg: async (req, res) => {
        const type = req.query.type;
    
        let verifyToken = "";
        let emaildata = {};
        switch (type) {
          case "company":
            const user = req.body;
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
                  await emailService.sendEmail({
                    to: [data.email.toString()],
                    subject: "Verify your account",
                    text: `Dear user,
                    @ Thanks for signing up to INsure!
                    Your verification pin is: ${verifyToken} `,

                    
                  });
    
                 
    
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
                    await db.company.create({...user, userId: data1.id})
                    //   emaildata.user = data1.firstName + " " + data1.lastName;
                      emaildata.verifyToken = data1.verifyToken;
                      await emailService.sendEmail({
                        to: [data.email.toString()],
                        subject: "Verify your account",
                        text: `Dear user,
                        @ ${req.body.companyName} has requested to you to be an agent 
                        to accept the request and make sure you use your registered email Thanks for signing up to Planvest!
                        Your verification pin is: ${verifyToken} `,
    
                      })    
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
            if (!req.body || !req.body.email ) {
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
                if (data && data.isVerified) {
                  res.status(400).send({
                    status: false,
                    message: "This Email is taken",
                  });
                } else if (data && !data.isVerified) {
                    const companyData = await db.company.findOne({where: {id: agentData.companyId}})
                    verifyToken = generator.generate({
                        length: 5,
                        numbers: true,
                      });
                      await emailService.sendEmail({
                        to: [data.email.toString()],
                        subject: "Verify your account",
                        text: `Dear user,
                        @ ${companyData.companyName} just invited you to INsure! Please visit this website to setup your account
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
                        await db.agent.create({...agentData, userId: data1.id})
                      emaildata.user = data1.cooperativeName;
                      emaildata.verifyToken = data1.verifyToken;
                      await emailService.sendEmail({
                        to: [data.email.toString()],
                        subject: "Verify your account",
                        text: `Dear user,
                        @ ${companyData.companyName} just invited you to INsure! Please visit this website to setup your account
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
      },}