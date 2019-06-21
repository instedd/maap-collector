import fs from 'fs'
const path = require('path')
import User from './user'

const basename = path.basename(__filename)

export default (fs.readdirSync(path.join(__dirname, 'models'))
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js' && file !== 'index.js'
  })
  .reduce((acc, file) => {
    const req = require(`./${file}`).default;
    return { [req.modelName]: req, ...acc }
  }, {}))
