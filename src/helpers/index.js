// importing all the modules
const getCommand = require('./getCommand');
const isAdmin = require('./isAdmin');
const saveToDb = require('./saveToDb');
const isRegistered = require('./isRegistered');
const hasPoints = require('./hasPoints');
const getUserWeapons = require('./getUserWeapons');

module.exports = {
  getCommand,
  isAdmin,
  saveToDb,
  isRegistered,
  hasPoints,
  getUserWeapons,
};
