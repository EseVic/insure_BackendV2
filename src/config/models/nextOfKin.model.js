module.exports = (sequelize, dataType) => {
  const nextOfKin = sequelize.define('nextOfKin', {
    name: {
      type: dataType.STRING,
      allowNull: false,
    },
    emailAddress: {
      type: dataType.STRING,
      allowNull: true,
    },
    address: {
      type: dataType.STRING,
      allowNull: true,
    },
    gender: {
      type: dataType.ENUM('male', 'female'),
      allowNull: true,
    },
    phoneNumber: {
      type: dataType.INTEGER,
      allowNull: true,
    },
  });
  return nextOfKin;
};
