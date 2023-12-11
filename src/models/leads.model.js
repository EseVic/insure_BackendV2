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
    Address: {
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
      defaultValue: 'new',

    },
    policyNumber: {
      type: dataType.INTEGER,
      allowNull: true,
    },
   
    totalAmountPaid: {
      type: dataType.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    role: {
      type: dataType.ENUM('leads', 'clients'),
      allowNull: false,
      defaultValue: "leads",
      trim: true,
    },
  });

  return leads;
};
