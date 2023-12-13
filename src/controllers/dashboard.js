const { db } = require("../models");



exports.dashController = {
companyDash: async (req, res) => {
    try {
        let companyId = req.params.companyId
      const agent = await db.agent.findAndCountAll({
        include: [
          {
            model: db.users, as: "users",
            where: { companyProfileId: companyId },
          },
        ],
      });
      let leads = []
      agent.rows.forEach( async (single) => {
        const lead  = await db.leads.findAAll({ agentId: single.Id });
        leads.push(...lead)
      });
      
      let claims = []
      leads.forEach(async single => {
        const claim = await db.claims.findAll({ leadid: single.Id })
        claims.push(...claim)
      });

      const totalSales = leads.reduce(
        (accumulator, single) => {
          return accumulator + single.totalAmountPaid;
        },
        0
      );

      const totalClaimAmount = claims.reduce(
        (accumulator, single) => {
          return accumulator + single.claimsAmount;
        },
        0
      );

     

      const value = {
        agent,
        leads,
        totalSales,
        claims,
        totalClaimAmount
      };

      res.status(200).send({
        status: true,
        data: value,
        message: "dashboard analytics gotten",
      });
    } catch (err) {
      res.status(400).send({
        status: false,
        message: "Could not fetch analytics" + err,
      });
    }
  },

  agentDash: async (req, res) => {
    try {
        let agentId = req.params.agentId
 
        const leads  = await db.leads.findAndCountAll({ agentId });
  
      const totalSales = leads.rows.reduce(
        (accumulator, single) => {
          return accumulator + single.totalAmountPaid;
        },
        0
      );

      let claims = []

      leads.rows.forEach(async single => {
        const claim = await db.claims.findAll({ leadid: single.Id })
        claims.push(...claim)
      });

      const totalClaimAmount = claims.reduce(
        (accumulator, single) => {
          return accumulator + single.claimsAmount;
        },
        0
      );

     

      const value = {
        leads,
        totalSales,
        claims,
        totalClaimAmount
      };

      res.status(200).send({
        status: true,
        data: value,
        message: "dashboard analytics gotten",
      });
    } catch (err) {
      res.status(400).send({
        status: false,
        message: "Could not fetch analytics" + err,
      });
    }
  },
}