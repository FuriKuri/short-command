var fs = require('fs');

module.exports = function() {
  fs.readFile(getUserHome() + '/.zsh_history', 'utf8', (err, data) => {
  if (err) throw err;
    console.log(data);
  });
}

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}
