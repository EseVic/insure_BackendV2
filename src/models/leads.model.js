const validator = require('validator');

module.exports = (sequelize, dataType) => {
  const leads = sequelize.define('leads', {
    firstName: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    lastName: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    middleName: {
      type: dataType.STRING,
      allowNull: false,
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
    gender: {
      type: dataType.ENUM('male', 'female'),
      allowNull: false,
      trim: true,
    },
    Adress: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
    },
    phoneNumber: {
      type: dataType.INTEGER,
      allowNull: false,
      trim: true,
    },
    status: {
      type: dataType.ENUM('new', 'in progress', 'closed'),
      allowNull: false,
    },
    policyNumber: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    premiumAmount: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    totalAmountPaid: {
      type: dataType.INTEGER,
      allowNull: false,
    },
    role: {
      type: dataType.ENUM('leads', 'clients'),
      allowNull: false,
      trim: true,
    },
  });

  return leads;
};
