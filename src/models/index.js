const Sequelize = require('sequelize');
const { sequelize } = require('../config/config');
const logger = require('../config/logger');
const fs = require("fs");

const sequelizeInstance = new Sequelize(sequelize.url);
const db = {};

// const sequelizeInstance = new Sequelize(sequelize.database, sequelize.user, sequelize.password, {
//   host: sequelize.host,
//   dialect: sequelize.dialect,
//   pool: {
//     min: 0,
//     max: 100,
//     acquire: 5000,
//     Idle: 1000,
//   },
// });


sequelizeInstance
  .authenticate()
  .then(() => logger.info('DB connected'))
  .catch((err) => {
    logger.error(err);
  });

db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

db.users = require('./user.model')(sequelizeInstance, Sequelize);
db.tokens = require('./token.model')(sequelizeInstance, Sequelize);
db.company = require('./company_profile.model')(sequelizeInstance, Sequelize);
db.leads = require('./leads.model')(sequelizeInstance, Sequelize);
db.agent = require('./agent.model')(sequelizeInstance, Sequelize);
db.leads = require('./leads.model')(sequelizeInstance, Sequelize);
db.claims = require('./claims.model')(sequelizeInstance, Sequelize);
db.pricing = require('./pricingPlan.model')(sequelizeInstance, Sequelize);
db.portfolio = require('./portfolio.model')(sequelizeInstance, Sequelize);
db.policy = require('./policy.model')(sequelizeInstance, Sequelize);
db.nextOfKin = require('./nextOfKin.model')(sequelizeInstance, Sequelize);
db.superAdmin = require('./superAdmin.model')(sequelizeInstance, Sequelize);
db.premiumTransaction = require('./premiumTransaction.model')(sequelizeInstance, Sequelize);

// relationships for models

db.users.hasOne(db.agent)
db.agent.belongsTo(db.users);

db.users.hasOne(db.company)
db.company.belongsTo(db.users);

db.company.hasMany(db.agent);
db.agent.belongsTo(db.company);

db.agent.hasMany(db.leads);
db.leads.belongsTo(db.agent)


// // db.pricing.hasOne(db.subscription);
// // db.subscription.belongsTo(db.pricing);

// // db.subscription.hasMany(db.company);
// // db.company.belongsTo(db.subscription);

db.company.belongsToMany(db.leads, {through: "company_leads"})
db.leads.belongsToMany(db.company, {through: "company_leads"});

db.leads.hasOne(db.nextOfKin);
db.nextOfKin.belongsTo(db.leads);

db.policy.hasOne(db.leads);
db.leads.belongsTo(db.policy);

db.leads.hasMany(db.claims);
db.claims.belongsTo(db.leads);

db.company.hasMany(db.policy);
db.policy.belongsTo(db.company);

db.leads.hasMany(db.premiumTransaction);
db.premiumTransaction.belongsTo(db.leads);



module.exports = {
  db,
};
