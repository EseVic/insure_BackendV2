module.exports = (sequelize, dataType) => {
  const premiumTransaction = sequelize.define('premiumTransaction', {
    premiumType: {
      type: dataType.ENUM('Standard', 'Pro', 'Advanced'),
      allowNull: true,
    },
    duration: {
      type: dataType.STRING,
      allowNull: false,
    },
    modeOfPayment: {
      type: dataType.ENUM('weekly', 'monthly', 'annually'),
      allowNull: false,
    },
    totalAmountPaid: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    accountStatus: {
      type: dataType.ENUM('pending', 'declined', 'approved'),
      allowNull: false,
    },
    premiumTotalAmount: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    interest: {
      type: dataType.INTEGER,
      allowNull: false,
    },
  });
  return premiumTransaction;
};
