module.exports = (sequelize, dataType) => {
  const companyProfile = sequelize.define('companyProfile', {
    companyName: {
      type: dataType.STRING,
      allowNull: false,
    },
    companyAddress: {
      type: dataType.STRING,
      allowNull: false,
    },
    license: {
      type: dataType.STRING,
      allowNull: false,
    },
    teamCapacity: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    email: {
      type: dataType.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      lowercase: true,
      // validate(value) {
      //   if (!validator.isEmail(value)) {
      //     throw new Error('Invalid email');
      //   }
      // },
    },
  });

  // companyProfile.associate = (models) => {
  //   companyProfile.hasOne(models.Agent, {
  //     foreignKey: 'userId',
  //     onDelete: 'CASCADE', // This ensures that when a user is deleted, the associated agent is also deleted
  //   });
  // };
  return companyProfile;
};
