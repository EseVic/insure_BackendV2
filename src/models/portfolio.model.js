module.exports = (sequelize, dataType) => {
  const portfolio = sequelize.define('portfolio', {
    totalNoOfClients: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    totalNoOfClaims: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    totalClaimsAmount: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    totalClientsAmount: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    activeClients: {
      type: dataType.STRING,
      allowNull: false,
    },
    inactiveClients: {
      type: dataType.STRING,
      allowNull: false,
    },
  });
  return portfolio;
};
