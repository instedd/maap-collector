const { spawn } = require('child_process');
const Octokit = require('@octokit/rest');
const fs = require('fs');
const { version } = require('./package.json');
const environments = require('./environments');

const { GITHUB_TOKEN } = process.env;
const octokit = Octokit({
  auth: GITHUB_TOKEN,
  userAgent: 'Maap collector release tool'
});

console.log('Releasing Maap collector');
console.log(`Version ${version}`);

const versionNameTag = (versionNumber, name) => `${versionNumber}-${name}`;
octokit.repos
  .listReleases({
    owner: 'instedd',
    repo: 'maap-collector'
  })
  .then(async data => {
    const { data: releases } = data;
    const environment = environments.find(k => k.name === process.env.INSTANCE);
    if (!process.env.INSTANCE)
      return console.log('INSTANCE env var is missing');
    const versionName = versionNameTag(version, environment.name);
    if (!releases.map(({ name }) => name).includes(versionName)) {
      octokit.repos.createRelease({
        owner: 'instedd',
        repo: 'maap-collector',
        tag_name: `V${versionName}`,
        draft: true,
        name: versionName
      });
    }
    console.log(`Releasing ${versionName} with config:`);
    console.log(environment.config);

    fs.writeFileSync(
      './app/constants/config.override.json',
      JSON.stringify(environment.config)
    );
    // eslint-disable-next-line
    const packageJson = require('./package.json');
    packageJson.version = versionName;
    fs.writeFileSync('./package.json', JSON.stringify(packageJson));
    await new Promise(resolve => {
      const ls = spawn('npm', ['run', 'package-ci']);
      ls.stdout.on('data', output => {
        console.log(`stdout: ${output.toString()}`);
      });

      ls.stderr.on('data', output => {
        resolve(output);
        console.log(`stderr: ${output.toString()}`);
      });

      ls.on('exit', output => {
        resolve(output);
        console.log(`child process exited with code ${output.toString()}`);
      });
    });
    return data;
  })
  .catch(err => console.log(err));
