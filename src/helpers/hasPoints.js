const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});
module.exports = async (userid, points, TABLE) => {
  const query = `SELECT points FROM ${TABLE} WHERE userid='${userid}'`;
  const data = await new Promise((resolve, reject) => {
    pool.query(query, (err, res) => {
      if (err) reject(err);
      else resolve(res.rows[0].points);
    });
  });
  return !(data < points);
};
