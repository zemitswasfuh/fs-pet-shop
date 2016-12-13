# Node Filesystem

![pet-shop](https://i.imgur.com/9tvF4Lx.jpg)

A local pet shop keeps a database for all the pets they have in stock. However, they need you to build a command-line application in Node to handle a variety of subcommands and log the results to the console.

The subcommands will be in the form of create, read, update, and destroy (CRUD). These subcommands will manage their database, which is a JSON-formatted `pets.json` file. Once the subcommand is correctly handled, the app will need to log an appropriate result to the console. Details of the subcommands the app will need to handle and their output can be found below.

## Getting started

After you fork and clone this repository to your development environment, change into the project directory and install any dependencies.

```shell
cd path/to/project
npm install
```

Ignore `node_modules` from the repository. This prevents your node modules folder from being included in your repository.

```shell
echo 'node_modules' >> .gitignore
```

Create a `pets.js` file for your filesystem code.

```shell
touch pets.js
```

Create a `.eslintrc.js` file and add your preferred linting rules.

```shell
touch .eslintrc.js
```

## Assignment

Your first task is to build a command-line application that displays its usage, ideally to the [standard error]['stderr'] channel, when invoked without a subcommand. The app should [exit the process]['exit'] with a non-zero exit code to indicate that it failed to complete any work.

```shell
$ node pets.js
Usage: node pets.js [read | create | update | destroy]
```

Your next task is to refactor the application to handle the `read` subcommand via the [process arguments]['argv'], read the `pets.json` file, parse its data to a native JavaScript object, and log it to the console. If the call to the filesystem fails for any reason, it should throw the resulting error.

```shell
$ node pets.js read
[ { age: 7, kind: 'rainbow', name: 'fido' },
  { age: 5, kind: 'snake', name: 'Buttons' } ]
```

Additionally, your application must handle the `read` subcommand when given an index. In this case, it must read the `pets.json` file, parse its data to a native JavaScript object, access the correct record, and log it to the console. If the call to the filesystem fails for any reason, it should throw the resulting error.

```shell
$ node pets.js read 0
{ age: 7, kind: 'rainbow', name: 'fido' }

$ node pets.js read 1
{ age: 5, kind: 'snake', name: 'Buttons' }
```

Additionally, your application must handle the `read` subcommand when given an out-of-bound index. In this case, it must display a more specific usage to the standard error channel and exit with a non-zero exit code.

```shell
$ node pets.js read 2
Usage: node pets.js read INDEX

$ node pets.js read -1
Usage: node pets.js read INDEX
```

Finally, your application must also handle the `create` subcommand. Only when given an `age`, `kind`, and `name` will it create a record in the database. Remember to convert the `age` into an integer. For example:

```shell
$ node pets.js create
Usage: node pets.js create AGE KIND NAME

$ node pets.js create 3
Usage: node pets.js create AGE KIND NAME

$ node pets.js create 3 parakeet
Usage: node pets.js create AGE KIND NAME

$ node pets.js create 3 parakeet Cornflake
{ age: 3, kind: 'parakeet', name: 'Cornflake' }

$ node pets.js read 2
{ age: 3, kind: 'parakeet', name: 'Cornflake' }
```

If the `pets.json` file ever becomes corrupted, you can reset it with the `git checkout` command.

```shell
$ git checkout -- pets.json
```

We have provided tests for you to check your work. To run the command for this exercise, run the following command.

```shell
$ npm test test/pets.test.js
```

## Bonus

Refactor your app to also update records in the database when given the `update` subcommand. Remember to convert the `age` into an integer. For example:

```shell
$ node pets.js update
Usage: node pets.js update INDEX AGE KIND NAME

$ node pets.js update 1
Usage: node pets.js update INDEX AGE KIND NAME

$ node pets.js update 1 9
Usage: node pets.js update INDEX AGE KIND NAME

$ node pets.js update 1 9 cat
Usage: node pets.js update INDEX AGE KIND NAME

$ node pets.js update 1 9 cat Rosey
{ age: 9, kind: 'cat', name: 'Rosey' }

$ node pets.js read 1
{ age: 9, kind: 'cat', name: 'Rosey' }
```

## Bonus

Refactor your app to also destroy records in the database when given the `destroy` subcommand. For example:

```shell
$ node pets.js destroy
Usage: node pets.js destroy INDEX

$ node pets.js destroy 1
{ age: 5, kind: 'snake', name: 'Buttons' }

$ node pets.js read
[ { age: 7, kind: 'rainbow', name: 'fido' } ]
```

## Bonus

Convert the code in your `pets.js` file into ES6 syntax. It may be helpful to use linting rules to assist in the conversion.

- [`eslint-config-airbnb`]['airbnb']
- [`eslint-config-ryansobol`]['ryansobol']

## Bonus

Add a shebang(#!) to the start of the `pets.js` file and modify its permissions so it can be run from the command-line without the `node` command. For example:

```shell
$ ./pets.js read
[ { age: 7, kind: 'rainbow', name: 'fido' },
  { age: 5, kind: 'snake', name: 'Buttons' } ]

$ ./pets.js read 0
{ age: 7, kind: 'rainbow', name: 'fido' }

$ ./pets.js create 3 parakeet Cornflake
{ age: 3, kind: 'parakeet', name: 'Cornflake' }

$ ./pets.js read
[ { age: 7, kind: 'rainbow', name: 'fido' },
  { age: 5, kind: 'snake', name: 'Buttons' },
  { age: 3, kind: 'parakeet', name: 'Cornflake' } ]
```

## Bonus Tests

We have provided tests for you to check your work for the bonus specifically. To run the command for this exercise, run the following command.

```shell
$ npm test test/pets.bonus.test.js
```

['airbnb']: https://www.npmjs.com/package/eslint-config-airbnb
['argv']: https://nodejs.org/api/process.html#process_process_argv
['exit']: https://nodejs.org/api/process.html#process_process_exit_code
['ryansobol']: https://github.com/ryansobol/eslint-config-ryansobol#language-configuration
['stderr']: https://nodejs.org/api/console.html#console_console_error_data
