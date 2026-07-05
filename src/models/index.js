const sequelize = require('./sequelize');
const User = require('./User');
const Product = require('./Product');

User.hasMany(Product, { foreignKey: 'userId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, Product };
