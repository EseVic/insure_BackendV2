module.exports = (sequelize, dataType) => {
  const userAgent = sequelize.define('user_agent', {
    userId: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    agentId: {
      type: dataType.INTEGER,
      allowNull: true,
    },
  });
  return userAgent;
};
