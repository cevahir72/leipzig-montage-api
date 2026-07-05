const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

try {
  sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} catch (error) {
  console.error('Veritabanı bağlantı hatası:', error);
  process.exit(1);
}

module.exports = sequelize;
