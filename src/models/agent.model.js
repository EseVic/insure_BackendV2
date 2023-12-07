module.exports = (sequelize, dataType) => {
  const agent = sequelize.define('agent', {
    hasChangedPassword: {
      type: dataType.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    firstName: {
      type: dataType.STRING,
      allowNull: true,
      trim: true,
    },
    lastName: {
      type: dataType.STRING,
      allowNull: true,
      trim: true,
    },
    middleName: {
      type: dataType.STRING,
      allowNull: true,
      trim: true,
    },
    gender: {
      type: dataType.ENUM('male', 'female'),
      allowNull: true,
      trim: true,
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

  agent.associate = (models) => {
    agent.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    agent.associate = (companyProfile) => {
      agent.belongsTo(model.companyProfile, {
        foreignKey: 'companyProfileId',
        onDelete: 'CASCADE',
      });
    };
  };

  return agent;
};
