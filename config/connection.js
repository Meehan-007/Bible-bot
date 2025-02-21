import dotenv from 'dotenv';
dotenv.config();



import Sequelize from 'sequelize';

let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(process.env.DB, process.env.USERNAME, process.env.PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });
}
export default sequelize;