var fs = require('fs');

module.exports = function() {
  fs.readFile(getUserHome() + '/.zsh_history', 'utf8', (err, data) => {
    if (err) throw err;
    var lines = data.split('\n');
    var result = lines
        .map(extractCommand)
        .filter(line => line != null)
        .reduce((map, command) => {
          map.set(command, (map.get(command) || 0) + 1);
          return map;
        }, new Map());
        
    result = Array
        .from(result)
        .filter(entry => entry[1] > 10)
        .filter(entry => entry[0].length > 10)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);;
    console.log(result);
  });
}

function extractCommand(value) {
  var parts = value.split(':');
  if (parts[2]) {
    var timeStamp = parts[1];
    return parts[2].split(';')[1];
  } else {
    return null;
  }
}

function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}
