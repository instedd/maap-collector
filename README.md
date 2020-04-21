# Maap Collector

[![Build Status](https://travis-ci.org/instedd/maap-collector.svg?branch=master)](https://travis-ci.org/instedd/maap-collector)

## Development environment

Prepare your dev environment by setting node to version 10.15.3:

```
$ npm install -g node@10.15.3
```

Install [sqlite](https://sqlite.org/index.html) and [sqlcipher](https://www.zetetic.net/sqlcipher/) locally:

```
$ brew install sqlite
$ brew install sqlcipher
```

- Install dependencies with yarn.
- Start the app in the `dev` environment.

```
$ yarn
$ yarn dev
```

### Useful commands

```
# Identify any issues in staged files
$ yarn precommit

# Run tests
$ yarn build-e2e
$ yarn test-e2e
```

## Migrations

Migrations are based on Sequelized's Umzug library. So if there's anything missing here, try taking a look at: https://github.com/sequelize/umzug.

When you introduce a schema change, you should add a migration to the `app/db/migrations` folder.
Please number them sequentially (`xxx_some_descriptive_migration_name`), and pay attention to clashes with upstream when
merging.

Migrations should be modules that export `up` and `down` functions like this one:

```javascript
module.exports = {
  up: function(query, DataTypes) {
    return query.createTable('test', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.TEXT
      },
      lastName: {
        type: DataTypes.TEXT
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },
  down: function down(query, DataTypes) {
    return query.dropTable('test');
  }
};
```

`query` is a query interface to the live, unencrypted database exposed through a Sequelize instance,
so you can run any Sequelize query as part of your migrations.

IMPORTANT: don't use model classes, as those evolve with code. Remember migrations work against the database,
so you can't assume anything about the concrete version of the code you're running.

Migrations will be checked and run everytime the app starts, provided the user has succeeded in opening the database.

`up` and `down` functions are regular Javascript code, so you can run any other upgrade processes inside migrations.

Whenever you modify the schema, take into account how the data should evolve from the previous schema version to the one
you're introducing (e.g.: if you're adding a column, should you be setting a default value for existing rows?).
