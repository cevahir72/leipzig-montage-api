const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

try {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
    }
  );
} catch (error) {
  console.error('Veritabanı bağlantı hatası:', error);
  process.exit(1);
}

module.exports = sequelize;
