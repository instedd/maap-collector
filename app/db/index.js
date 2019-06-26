import Sequelize from 'sequelize';
import * as models from '../models';

const initialize = (dbName, password) => {
  const sequelize = new Sequelize(null, null, password, {
    dialect: 'sqlite',
    dialectModulePath: '@journeyapps/sqlcipher',
    storage: `app/db/storage/${dbName}.sqlite`
  });
  Object.values(models.default).forEach(model => model(sequelize));
  sequelize.sync();
};

export default { initialize };
