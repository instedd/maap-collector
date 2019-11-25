require('dotenv').config();

const {
  API_URL = 'https://maap-zw.instedd.org',
  ELECTRON_ENV = 'development'
} = process.env;

export { API_URL, ELECTRON_ENV };
