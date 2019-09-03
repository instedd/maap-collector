import Sequelize from 'sequelize';
import { remote } from 'electron';
import * as models from '../models';

const initialize = async (dbName, password) => {
  const sequelize = new Sequelize(null, null, password, {
    dialect: 'sqlite',
    dialectModulePath: '@journeyapps/sqlcipher',
    storage: `${remote.app.getPath(
      'userData'
    )}/maap/app/db/storage/${dbName}.sqlite`,
    logging: false
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
  await sequelize.sync();
  return objects;
};

const initializeForUser = async ({ data }) => initialize('1', data.password);

export default { initialize, initializeForUser };
