const { db } = require('../models');

const createCompany = async (userId, companyBody) => {
  return await db.company.create({
    userId,
    ...companyBody,
  });
};

const getCompanyById = async(companyId)=>{
  return await db.company.findOne({
    where:{
      id:companyId,
    }
  })
}

module.exports = {
  createCompany,
  getCompanyById
};
