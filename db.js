const Sequelize = require('sequelize');

const sequelize = new Sequelize ("postgres://postgres:Corona14@localhost:5432/workoutlogserver");

module.exports = sequelize