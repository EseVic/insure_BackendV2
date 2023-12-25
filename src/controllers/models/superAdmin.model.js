module.exports = (sequelize, dataType) => {
    const superAdmin = sequelize.define('superAdmin', {
        companyId: {
        type: dataType.INTEGER,
        allowNull: false,
      },
      subscriptionRef:{
        type: dataType.INTEGER,
        allowNull: false
      },
      noOfCompanies:{
        type: dataType.INTEGER,
        allowNull: false
      },
      paymentStatus:{
        type: dataType.ENUM("pending", "successful", "failed")
      }
    });
    return superAdmin;
  };