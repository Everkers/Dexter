module.exports = (string, prefix) => {
  const [command, ...others] = string.slice(prefix.length).split(/ +/);
  return !others ? [command] : [command, others];
};
