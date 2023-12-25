module.exports = (sequelize, dataType) => {
  const subscription = sequelize.define('subscription', {
    pricingType: {
      type: dataType.STRING,
      allowNull: true,
    },
    duration: {
      type: dataType.STRING,
      allowNull: true,
    },
    amount: {
      type: dataType.INTEGER,
      allowNull: true,
    },
    expirationDate: {
      type: dataType.INTEGER,
      allowNull: true,
    },
    status: {
      type: dataType.ENUM('active', 'inactive', 'canceled'),
    },
  });
  return subscription;
};
