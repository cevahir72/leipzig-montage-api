const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

try {
  const url = new URL(process.env.POSTGRES_URL_NON_POOLING);
  sequelize = new Sequelize(url.pathname.slice(1), url.username, url.password, {
    host: url.hostname,
    port: url.port,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });
} catch (error) {
  console.error('Veritabanı bağlantı hatası:', error);
  process.exit(1);
}

module.exports = sequelize;
