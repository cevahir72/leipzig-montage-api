require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL bağlantısı başarılı');

    await sequelize.sync({ alter: true });
    console.log('Tablolar senkronize edildi');

    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
    });
  } catch (error) {
    console.error('Başlangıç hatası:', error);
    process.exit(1);
  }
}

start();
