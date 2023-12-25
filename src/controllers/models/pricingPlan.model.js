module.exports = (sequelize, dataType) => {
  const pricing = sequelize.define('pricing', {
    amount: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    type: {
      type: dataType.STRING,
      allowNull: false,
    },
    duration: {
      type: dataType.STRING,
      allowNull: false,
    },
    teamCapacity: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    features: {
      type: dataType.STRING,
      allowNull: false,
    },
  });
  return pricing;
};
