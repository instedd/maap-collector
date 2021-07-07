const { spawn } = require('child_process');
const fs = require('fs');
const { version } = require('./package.json');
const environments = require('./environments');

if (!process.env.INSTANCE) {
  return console.log('INSTANCE env var is missing');
}

console.log('Releasing Maap collector');
console.log(`Version ${version}`);

const versionNameTag = (versionNumber, name) => `${versionNumber}-${name}`;
const environment = environments.find(k => k.name === process.env.INSTANCE);
const versionName = versionNameTag(version, environment.name);
console.log(`Releasing ${versionName} with config:`);
console.log(environment.config);

fs.writeFileSync(
  './app/constants/config.override.json',
  JSON.stringify(environment.config)
);
// eslint-disable-next-line
const packageJson = require('./package.json');
packageJson.version = versionName;
packageJson.name = `maap-collector-${process.env.INSTANCE}`;
packageJson.productName = `Maap Collector ${process.env.INSTANCE}`;
packageJson.productName = `Maap Collector ${process.env.INSTANCE}`;
packageJson.build.productName = `Maap Collector ${process.env.INSTANCE}`;
packageJson.build.appId = `org.develar.MaapCollector${process.env.INSTANCE.toUpperCase()}`;
fs.writeFileSync('./package.json', JSON.stringify(packageJson));
const packageTask = spawn('yarn', ['package-ci'], {
  shell: process.platform === 'win32'
});
packageTask.stdout.on('data', output => {
  console.log(`stdout: ${output.toString()}`);
});
packageTask.stderr.on('data', output => {
  console.log(`stderr: ${output.toString()}`);
});
packageTask.on('exit', output => {
  console.log(`child process exited with code ${output.toString()}`);
});
