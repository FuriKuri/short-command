const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
        .slice(0, 4);

    var aliases = [];
    var i = 0;
    rl.on('line', (input) => {
      aliases.push({
        command: result[i][0],
        alias: input
      });
      i = i + 1;
      if (i === 4) {
        rl.close();
        writeFile(aliases);
      } else {
        console.log(`New alias for '${result[i][0]}': `);
      }
    });
    console.log(`New alias for '${result[i][0]}': `);
  });
}

function writeFile(aliases) {
  var fileConent = aliases
      .map(entry => `alias ${entry.alias}='${entry.command}'`)
      .join('\n');
  checkDirectorySync(getUserHome() + '/.top-cmd');
  fs.writeFile(getUserHome() + '/.top-cmd/aliases', fileConent, { flag : 'w+' }, (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
    console.log('Execute:\n echo "source ~/.top-cmd/aliases" >> ~/.zshrc');
  });
}

function checkDirectorySync(directory) {
  try {
    fs.statSync(directory);
  } catch(e) {
    fs.mkdirSync(directory);
  }
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
