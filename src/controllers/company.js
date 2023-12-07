const { db } = require("../models");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
require("dotenv").config();
const { emailService } = require('../services');

const axios = require("axios");
const generator = require("generate-password");
const { email } = require("../config/config");



exports.authController = {

 getAllCompanyAgents: (req, res) => {
    let companyId = req.params.companyId
    db.agent
      .findAndCountAll({
        include: [{
          model: db.company,
          as: "company",
          where: {id: companyId}
      }]
      })
      .then((data) => {
        res.status(200).send({
          data,
          status: true,
          message: "all agents retrieved successfully",
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
          status: false
        });
      });
  },

  getSingleAgentInfo: (req, res) => {
    let agentId = req.params.agentId
    db.agent
      .findAndCountAll({
        include: [{
          model: db.company,
          as: "company",
          where: {id: agentId}
      }]
      })
      .then((data) => {
        res.status(200).send({
          data,
          status: true,
          message: "agent info retrieved successfully",
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
          status: false
        });
      });
  },

}