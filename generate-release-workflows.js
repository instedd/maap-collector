const fs = require('fs');

const template = fs.readFileSync('./release.yml');

[
  'demo',
  'staging',
  'bf',
  'cm',
  'ga',
  'gh',
  'ke',
  'mw',
  'ng',
  'sl',
  'sn',
  'sz',
  'tz',
  'ug',
  'zm',
  'zw'
].forEach(instanceCode => {
  fs.writeFileSync(
    `./.github/workflows/release-${instanceCode}.yml`,
    template.toString().replace(/__INSTANCE__/g, instanceCode)
  );
});
