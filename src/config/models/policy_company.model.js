module.exports = (sequelize, dataType) => {
  const policyCompany = sequelize.define('policy_company', {
    company_profileId: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    policyId: {
      type: dataType.INTEGER,
      allowNull: true,
    },
  });
  return policyCompany;
};
