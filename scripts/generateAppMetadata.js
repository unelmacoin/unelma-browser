const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const metadata = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  author: pkg.author,
  license: pkg.license,
  homepage: pkg.homepage
};

fs.writeFileSync(
  path.join(__dirname, '../src/app-metadata.json'),
  JSON.stringify(metadata, null, 2)
);
