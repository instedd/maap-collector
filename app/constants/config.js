require('dotenv').config();

const {
  API_URL = 'http://localhost:3000',
  ELECTRON_ENV = 'development'
} = process.env;

export { API_URL, ELECTRON_ENV };
