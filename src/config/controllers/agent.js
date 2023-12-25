const { db } = require("../models");
// const bcrypt = require("bcryptjs");
// const { sign } = require("jsonwebtoken");
require("dotenv").config();
// const { emailService } = require('../services');

// const axios = require("axios");
// const generator = require("generate-password");
// const { email } = require("../config/config");



exports.agentController = {


 createLeads: (req, res) => {
  let agentId = req.params.agentId
  const payload = {agentId: agentId, ...req.body}
  db.leads.create(payload)
  .then(async (data) => {
      res.status(200).send({
          data,
          status: true,
          message: "Leads created successfully!",
        });
  })
  .catch((err) => {
    res.status(400).send({
      message: err.message || "Could not find record!",
      status: false
    });
  });
},

 getAllAgentLeads: (req, res) => {
  let agentId = req.params.agentId

    db.leads
      .findAndCountAll({
        where: {agentId: agentId},
        include: [{
          model: db.policy,
          as: "policy",   
      }],

      })
      .then((data) => {
        res.status(200).send({
          data,
          status: true,
          message: "all agents leads retrieved successfully!",
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record!",
          status: false
        });
      });
  },

  getSingleAgentLead: (req, res) => {
    // let agentId = req.params.agentId
    let leadId = req.params.leadId

    db.leads
      .findOne({
        where: {id: leadId},
        include: [{
          model: db.policy,
          as: "policy",   
      },
      {
        model: db.agent,
        as: "agent",   
    }
    ],

      })
      .then((data) => {
        res.status(200).send({
          data,
          status: true,
          message: "agent lead retrieved successfully!",
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record!",
          status: false
        });
      });
  },

  updateLead: (req, res) => {
    let leadId = req.params.leadId
    const payload = req.body
    db.policy.update(payload, {
        where: {
          id: leadId,
        },
      })
    .then(async (data) => {
        res.status(200).send({
            data,
            status: true,
            message: "Lead updated successfully!",
          });
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Could not find record!",
        status: false
      });
    });
 },

}