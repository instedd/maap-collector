const override = require('./config.override.json');

require('dotenv').config();

const {
  API_URL = 'https://maap-stg.instedd.org',
  ELECTRON_ENV = 'development'
} = {
  ...process.env,
  ...override
};

export { API_URL, ELECTRON_ENV };
