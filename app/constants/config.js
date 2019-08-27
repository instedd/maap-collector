require('dotenv').config();

const {
  API_URL = 'https://maap-demo.instedd.org',
  ELECTRON_ENV = 'development'
} = process.env;

export { API_URL, ELECTRON_ENV };
