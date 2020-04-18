const { Pool } = require('pg');
const saveToDb = require('./saveToDb');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});
module.exports = async (userid, username, TABLE) => {
  const query = `SELECT exists( SELECT 1 FROM ${TABLE} WHERE userid='${userid}' LIMIT 1 )`;
  const data = await new Promise((resolve, reject) => {
    pool.query(query, (err, res) => {
      if (err) reject(err);
      else resolve(res.rows[0].exists);
    });
  });
  if (!data) {
    saveToDb(TABLE, ['name', 'userid'], [`'${username}'`, `'${userid}'`]);
  }
};
