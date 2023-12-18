module.exports = (sequelize, dataType) => {
  const claim = sequelize.define('claim', {
    status: {
      type: dataType.ENUM('filed', 'in progress', 'approve'),
      allowNull: true,
    },
    claimsAmount: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    paymentStatus: {
      type: dataType.STRING,
      allowNull: false,
    },
    claimsDescription: {
      type: dataType.STRING,
      allowNull: false,
    },
    submittedDate: {
      type: dataType.DATE,
      allowNull: false,
    },
  });
  return claim;
};
