import Sequelize from 'sequelize';
import * as models from '../models';

const initialize = async (dbName, password) => {
  const sequelize = new Sequelize(null, null, password, {
    dialect: 'sqlite',
    dialectModulePath: '@journeyapps/sqlcipher',
    storage: `app/db/storage/${dbName}.sqlite`,
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

const initializeForUser = async ({ data }) =>
  initialize(data.response.id, data.password);

export default { initialize, initializeForUser };
