const validator = require('validator');

module.exports = (sequelize, dataType) => {
  const user = sequelize.define('user', {
    phoneNumber: {
      type: dataType.STRING,
      allowNull: true,
      trim: true,
    },
    email: {
      type: dataType.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: dataType.STRING,
      allowNull: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
    },
    isEmailVerified: {
      type: dataType.BOOLEAN,
    },
    role: {
      type: dataType.ENUM('company', 'agent', 'superAdmin'),
      allowNull: false,
      trim: true,
    },
  });

  user.associate = (models) => {
    user.hasOne(models.Agent, {
      foreignKey: 'userId',
      onDelete: 'CASCADE', // This ensures that when a user is deleted, the associated agent is also deleted
    });
  };

  return user;
};
