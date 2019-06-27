require('dotenv').config();

const { API_URL, ELECTRON_ENV = 'development' } = process.env;

export { API_URL, ELECTRON_ENV };
