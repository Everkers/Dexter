module.exports = (string, prefix) => {
  const args = string.slice(prefix.length).split(/ +/);
  return args.shift().toLowerCase();
};
module.exports.help = {
  name: 'getCommand',
  description: 'get command from a string',
};
