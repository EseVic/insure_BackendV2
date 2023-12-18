const { db } = require("../models");
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
require("dotenv").config();
const { emailService } = require('../services');

const axios = require("axios");
const generator = require("generate-password");
const { email } = require("../config/config");



exports.companyController = {

 createPolicy: (req, res) => {
    let companyId = req.params.companyId
    const payload = {companyProfileId: companyId, ...req.body}
    db.policy.create(payload)
    .then(async (data) => {
        res.status(200).send({
            data,
            status: true,
            message: "Policy created successfully",
          });
    })
    .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
          status: false
        });
      });
 },


 updatePolicy: (req, res) => {
    let policyId = req.params.policyId
    const payload = req.body
    db.policy.update(payload, {
        where: {
          id: policyId,
        },
      })
    .then(async (data) => {
        res.status(200).send({
            data,
            status: true,
            message: "Policy updated successfully",
          });
    })
    .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
          status: false
        });
      });
 },

  deletePolicy: (req, res) => {
    let policyId = req.params.policyId
    db.policy.destroy({
        where: {
          id: policyId,
        },
      })
    .then(async (data) => {
        res.status(200).send({
            data,
            status: true,
            message: "Policy deleted successfully",
          });
    })
    .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
          status: false
        });
      });
 },

 getCompanyPolicies: (req, res) => {
    let companyId = req.params.companyId
  
    db.policy.findAndCountAll({
        where: {
            companyProfileId: companyId
          },
      })
      .then((data) => {
        res.status(200).send({
            data,
            status: true,
            message: "All Policies retrieved successfully",
          });
    })
    .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
          status: false
        });
      });
 },

 getOneCompanyPolicy: (req, res) => {
   
    let policyId = req.params.policyId

  
    db.policy.findOne({
        where: {
            // companyProfileId: companyId,
            id: policyId
          },
      })
      .then((data) => {
        res.status(200).send({
            data,
            status: true,
            message: "Policy retrived successfully",
          });
    })
    .catch((err) => {
        res.status(400).send({
          message: err.message || "Could not find record",
          status: false
        });
      });
 },

 getAllCompanyAgents: (req, res) => {
    let companyId = req.params.companyId
    db.agent
      .findAndCountAll({
        include: [{
          model: db.company,
          as: "companyProfile",
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
      .findOne({
        include: [{
          model: db.company,
          as: "companyProfile",
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


  //Records
  getAllLeads: (req, res) => {
    let companyId = req.params.companyId
  
      db.leads
        .findAndCountAll({
          include: [{
            where: {companyProfileId: companyId},
            model: db.agent,
            as: "agent",   
        },{
            model: db.policy,
            as: "policy",   
        }],
  
        })
        .then((data) => {
          res.status(200).send({
            data,
            status: true,
            message: "all agents leads retrieved successfully",
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