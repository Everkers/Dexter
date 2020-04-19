const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});
module.exports = async (userid, WEAPON_TABLE, PLAYER_TABLE) => {
  const playerQuery = `SELECT weapons_id FROM ${PLAYER_TABLE} WHERE userid = '${userid}'`;
  const weaponsArray = [];
  const playerWeapons = await new Promise((resolve, reject) => {
    pool.query(playerQuery, (err, res) => {
      if (err) reject(err);
      else resolve(res.rows[0].weapons_id);
    });
  });
  for (let index = 0; index < playerWeapons.length; index += 1) {
    const weapon = playerWeapons[index];
    const query = `SELECT * FROM ${WEAPON_TABLE} WHERE id='${weapon}'`;
    // eslint-disable-next-line no-await-in-loop
    const data = await new Promise((resolve, reject) => {
      pool.query(query, (err, res) => {
        if (err) reject(err);
        else resolve(res.rows[0]);
      });
    });
    weaponsArray.push(data);
  }

  return weaponsArray;
};
