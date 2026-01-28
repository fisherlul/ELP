const fs = require("fs");

const LOG_FILE = "log.txt";
fs.writeFileSync(LOG_FILE, "=== FLIP 7 GAME LOG ===\n");

function log(message) {
  console.log(message);
  fs.appendFileSync(LOG_FILE, message + "\n");
}

module.exports = log;
