module.exports = (sequelize, dataType) => {
  const policy = sequelize.define('policy', {
    companyId: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    policyType: {
      type: dataType.STRING,
      allowNull: false,
    },
    duration: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    amount: {
      type: dataType.INTEGER,
      allowNull: false,
    },
  });
  return policy;
};
