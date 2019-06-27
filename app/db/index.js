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

const initializeForUser = ({ data }) =>
  initialize(data.response.id, data.password);

export default { initialize, initializeForUser };
