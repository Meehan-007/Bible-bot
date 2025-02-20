require('dotenv').config();


const Sequelize = require('sequelize');

let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(process.env.db, process.env.username, process.env.password, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });
}
module.exports = sequelize;