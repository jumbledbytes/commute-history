const fs = require("fs");

const getCredentials = (keyFile: string): string => {
  return fs.readFileSync(keyFile);
};

export { getCredentials };
