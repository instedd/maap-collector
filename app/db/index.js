import fs from 'fs';
import Sequelize from 'sequelize';
import { remote } from 'electron';
import * as models from '../models';

const storagePath = `${remote.app.getPath('userData')}/maap/app/db/storage/`;

const userDbPath = userId => `${storagePath}${userId}.sqlite`;

const userBackupPath = userId =>
  `${storagePath}${userId}-${new Date().getTime()}.sqlite`;

const initialize = async (dbName, password) => {
  const sequelize = new Sequelize(null, null, password, {
    dialect: 'sqlite',
    dialectModulePath: '@journeyapps/sqlcipher',
    storage: userDbPath(dbName),
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

const backup = ({ data }) => {
  const dbToBackup = userDbPath(data.response.id);
  const backupPath = userBackupPath(data.response.id);

  fs.copyFile(dbToBackup, backupPath, err => {
    if (err) return err;
    return true;
  });
};

export default { initialize, initializeForUser, backup };
