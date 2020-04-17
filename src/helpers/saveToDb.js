const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});
module.exports = (TABLE, COLUMNS, VALUES) => {
  const query = `INSERT INTO ${TABLE} (${COLUMNS.join(',')}) VALUES (${VALUES.join(',')})`;
  console.log(query);
  pool.query(query);
};
