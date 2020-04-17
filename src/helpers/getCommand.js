module.exports = (string, prefix) => {
  const [command, attr] = string.slice(prefix.length).split(/ +/);
  return !attr ? [command] : [command, attr];
};
