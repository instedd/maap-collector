import path from 'path';
import Umzug from 'umzug';
import db from './index';

const buildUmzug = sequelize =>
  new Umzug({
    storage: 'sequelize',
    storageOptions: {
      sequelize
    },

    // see: https://github.com/sequelize/umzug/issues/17
    migrations: {
      params: [
        sequelize.getQueryInterface(), // queryInterface
        sequelize.constructor, // DataTypes
        () => {
          throw new Error(
            'Migration tried to use old style "done" callback. Please upgrade to "umzug" and return a promise instead.'
          );
        }
      ],
      path: 'app/db/migrations',
      pattern: /\.js$/
    },
    logging: function logging(...args) {
      console.log.apply(null, args);
    }
  });

const logUmzugEvent = eventName => name => console.log(`${name} ${eventName}`);

const setUmzugLogHandlers = umzug => {
  umzug.on('migrating', logUmzugEvent('migrating'));
  umzug.on('migrated', logUmzugEvent('migrated'));
  umzug.on('reverting', logUmzugEvent('reverting'));
  umzug.on('reverted', logUmzugEvent('reverted'));
};

const logStatus = async umzug => {
  const executedMigrations = await umzug.executed();
  const pendingMigrations = await umzug.pending();

  const executed = executedMigrations.map(m => ({
    ...m,
    name: path.basename(m.file, '.js')
  }));

  const pending = pendingMigrations.map(m => ({
    ...m,
    name: path.basename(m.file, '.js')
  }));

  const current = executed.length > 0 ? executed[0].file : '<NO_MIGRATIONS>';
  const status = {
    current,
    executed: executed.map(m => m.file),
    pending: pending.map(m => m.file)
  };

  console.log(JSON.stringify(status, null, 2));

  return status;
};

export default async user => {
  console.log('Running migrations...');

  const { sequelize } = await db.initializeForUser(user, false);

  const umzug = buildUmzug(sequelize);
  setUmzugLogHandlers(umzug);

  const status = await logStatus(umzug);

  if (status.pending.length > 0) {
    console.log(
      'There are pending migrations. Creating a backup of the database before applying migrations.'
    );

    await db.backup(user);
    await umzug.up();
  }

  console.log('Migration complete!');
};
