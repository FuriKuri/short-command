var fs = require('fs');

module.exports = function() {
  fs.readFile(getUserHome() + '/.zsh_history', 'utf8', (err, data) => {
    if (err) throw err;
    var lines = data.split("\n");
    lines.forEach(line => {
      console.log(line)
    });
  });
}

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}
