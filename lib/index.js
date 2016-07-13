var fs = require('fs');

module.exports = function() {
  fs.readFile(getUserHome() + '/.zsh_history', 'utf8', (err, data) => {
    if (err) throw err;
    var lines = data.split('\n');
    lines.forEach(line => {
      var parts = line.split(':');
      if (parts[2]) {
        var timeStamp = parts[1];
        var command = parts[2].split(';')[1];
        console.log(command);
      }
    });
  });
}

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}
