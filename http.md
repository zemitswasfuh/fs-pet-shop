# Node HTTP Server

![pet-shop](https://i.imgur.com/Ec7j4nr.jpg)

A local pet shop keeps a database for all the pets they have in stock. However, they need you to build a server application in Node to handle a variety of HTTP requests and send an HTTP response back.

The HTTP requests will be commands in the form of create, read, update, and destroy (CRUD). These commands will manage their database, which is the same JSON-formatted `pets.json` file. Once the command is correctly handled, the app will need to send an appropriate HTTP response back. Details of the HTTP requests that the app will need to handle and their expected HTTP responses can be found below.

## Getting started

Change into the project directory.

```shell
$ cd path/to/project
```

Create an `httpServer.js` file for your HTTP server code.

```shell
$ touch httpServer.js
```

## Assignment

Your task is to build a Node server application that handles the following HTTP requests and sends back the correct HTTP response. Where appropriate, your application must read the correct data from the `pets.json` file and include it in the response body. Additionally, your application must send the appropriate response status code and `Content-Type` header.

| Request Method | Request URL | Response Status | Response Content-Type | Response Body                                                                                              |
|----------------|-------------|-----------------|-----------------------|------------------------------------------------------------------------------------------------------------|
| `GET`          | `/pets`     | `200`           | `application/json`    | `[{ "age": 7, "kind": "rainbow", "name": "fido" }, { "age": 5, "kind": "snake", "name": "Buttons" }]` |
| `GET`          | `/pets/0`   | `200`           | `application/json`    | `{ "age": 7, "kind": "rainbow", "name": "fido" }`                                                     |
| `GET`          | `/pets/1`   | `200`           | `application/json`    | `{ "age": 5, "kind": "snake", "name": "Buttons" }`                                                         |
| `GET`          | `/pets/2`   | `404`           | `text/plain`          | `Not Found`                                                                                                |
| `GET`          | `/pets/-1`  | `404`           | `text/plain`          | `Not Found`                                                                                                |

To test your HTTP server, first install the `nodemon` package globally.

```shell
$ npm install -g nodemon
```

Start the HTTP server with `nodemon`.

```shell
$ nodemon httpServer.js
```

Open a new shell tab and install HTTPie.

```shell
$ brew install httpie
```

Use the new `http` shell command to send HTTP requests to your server. Remember to set the port of your HTTP server to something like `8000`.

```shell
$ http GET localhost:8000/pets
```

We have provided tests for you to check your work. In order for the tests to run, you will need to export your server so the tests can import it in using `require`. To export your server, simply write the following line at the bottom of the file:

```javascript
module.exports = server;
```

where `server` is the variable that is assigned the result from `http.createServer`.

To run the test command for this exercise, run the following command.

```shell
$ npm test test/httpServer.test.js
```

## Bonus

See if you can simplify your route handler with the following regular expression.

```js
const petRegExp = /^\/pets\/(.*)$/;
```

You may find the following regular expression methods useful.

- [`RegExp.prototype.test()`]['test']
- [`String.prototype.match()`]['match']

Be mindful about responding to indices that don't exist in the database.

| Request Method | Request URL         | Response Status | Response Content-Type | Response Body |
|----------------|---------------------|-----------------|-----------------------|---------------|
| `GET`          | `/pets/9000`        | `404`           | `text/plain`          | `Not Found`   |
| `GET`          | `/pets/abracadabra` | `404`           | `text/plain`          | `Not Found`   |

## Bonus

Add a catch all route handler for unknown HTTP requests and send the appropriate response.

| Request Method | Request URL | Response Status | Response Content-Type | Response Body |
|----------------|-------------|-----------------|-----------------------|---------------|
| `GET`          | `/`         | `404`           | `text/plain`          | `Not Found`   |
| `GET`          | `/blah`     | `404`           | `text/plain`          | `Not Found`   |

## Bonus

Convert the code in your `server.js` file into ES6 syntax. It may be helpful to use linting rules to assist in the conversion.

- [`eslint-config-airbnb`]['airbnb']
- [`eslint-config-ryansobol`]['ryansobol']

## Bonus

In future parts of this assignment, your server will need to handle create, update, and destroy HTTP commands. For now, add a route handler that responds to create commands by adding new pets to the database.

| Request Method | Request URL | Request Body                                            | Response Status | Response Content-Type | Response Body                                           |
|----------------|-------------|---------------------------------------------------------|-----------------|-----------------------|---------------------------------------------------------|
| `POST`         | `/pets`     | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` | `200`           | `application/json`    | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` |
| `GET`          | `/pets/3`   | N/A                                                     | `200`           | `application/json`    | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` |

You can send create commands to the server app with the following command

```shell
http POST http://localhost:8000/pets age=3 kind=parakeet name=Cornflake
```

If `age`, `kind`, or `name` are missing from the HTTP request body or `age` is not an integer, then the data must not be added to the database and the server must send back the follow HTTP response.

| Request Method | Request URL | Request Body                               | Response Status | Response Content-Type | Response Body |
|----------------|-------------|--------------------------------------------|-----------------|-----------------------|---------------|
| `POST`         | `/pets`     | `{ "name": "", "age": "two", "kind": "" }` | `400`           | `text/plain`          | `Bad Request` |
| `GET`          | `/pets/4`   | N/A                                        | `404`           | `text/plain`          | `Not Found`   |

## Bonus Tests

We have provided tests for you to check your work for the bonus specifically. To run the command for this exercise, run the following command.

```shell
$ npm test test/httpServer.bonus.test.js
```

['airbnb']: https://www.npmjs.com/package/eslint-config-airbnb
['match']: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
['ryansobol']: https://github.com/ryansobol/eslint-config-ryansobol#language-configuration
['test']: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test
