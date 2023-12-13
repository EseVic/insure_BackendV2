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
      type: dataType.ENUM('not paid', 'in progress', 'paid'),
    },
    claimsDescription: {
      type: dataType.STRING,
      allowNull: false,
    },
    notificationDate: {
      type: dataType.DATE,
      allowNull: false,
    },
  });
  return claim;
};
