# Maap Collector

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

* Install dependencies with yarn.
* Start the app in the `dev` environment.

```
$ yarn
$ yarn dev
```

### Useful commands

```
# Run tests
$ yarn build-e2e
$ yarn test-e2e

```
