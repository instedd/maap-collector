import Sequelize from 'sequelize';
import * as models from '../models';

const initialize = (dbName, password) => {
  const sequelize = new Sequelize(null, null, password, {
    dialect: 'sqlite',
    dialectModulePath: '@journeyapps/sqlcipher',
    storage: `app/db/storage/${dbName}.sqlite`
  });
  const objects = Object.values(models.default)
    .map(model => model(sequelize))
    .reduce(
      (acc, m) => {
        acc[m.name] = m;
        return acc;
      },
      {
        sequelize
      }
    );
  sequelize.sync();
  return objects;
};

export default { initialize };
