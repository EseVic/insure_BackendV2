module.exports = (sequelize, dataType) => {
  const admin = sequelize.define('admin', {
    contactAddress: {
      type: dataType.STRING,
      allowNull: false,
    },
    userName: {
      type: dataType.STRING,
      allowNull: false,
    },
  });
  return admin;
};
