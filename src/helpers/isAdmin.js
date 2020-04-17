const { ADMIN_ID } = require('../../config.json');
/* check if the user is an admin of the bot */
/* make sure to add ADMIN_ID to your config json file */
module.exports = (userid) => userid === ADMIN_ID;
