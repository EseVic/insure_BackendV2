const { db } = require("../models");
// const bcrypt = require("bcryptjs");
// const { sign } = require("jsonwebtoken");
require("dotenv").config();
// const { emailService } = require('../services');


exports.claimsController = {


 createClaim: (req, res) => {
  let leadId = req.params.leadId
  const payload = {leadId, ...req.body}
  db.claims.create(payload)
  .then(async (data) => {
      res.status(200).send({
          data,
          status: true,
          message: "Claim created successfully!",
        });
  })
  .catch((err) => {
    res.status(400).send({
      message: err.message || "Could not find record!",
      status: false
    });
  });
},

 getAllClaims: (req, res) => {
  let agentId = req.params.agentId

    db.claims
      .findAndCountAll({
        include: [{
          model: db.leads,
          as: "lead",  
        where: {agentId: agentId},

      }],

      })
      .then((data) => {
        res.status(200).send({
          data,
          status: true,
          message: "all claims retrieved successfully!",
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record!",
          status: false
        });
      });
  },

  getSingleAClaim: (req, res) => {
    // let agentId = req.params.agentId
    let claimId = req.params.claimId

    db.claims
      .findOne({
        where: {id: claimId},
        include: [{
          model: db.leads,
          as: "lead",   
      }],

      })
      .then((data) => {
        res.status(200).send({
          data,
          status: true,
          message: "claim retrieved successfully!",
        });
      })
      .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record!",
          status: false
        });
      });
  },

  updateClaim: (req, res) => {
    let claimId = req.params.claimId

    const payload = req.body
    db.policy.update(payload, {
        where: {
          id: claimId,
        },
      })
    .then(async (data) => {
        res.status(200).send({
            data,
            status: true,
            message: "claim updated successfully!",
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