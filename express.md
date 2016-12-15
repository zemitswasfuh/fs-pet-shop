# Express HTTP server

![pet-shop](https://i.imgur.com/rDxrIKA.jpg)

Now that you've built a Node HTTP server, today's assignment is to convert it to Express.

## Getting started

Change into the project directory.

```shell
cd path/to/project
```

Create and switch to a new feature branch.

```shell
git checkout -b express_server
```

Install `express` as a dependency.

```shell
npm install --save express
```

## Assignment

Your task is to convert the Node HTTP server you built yesterday into an Express HTTP server (specifically in a new file `expressServer.js`). As before, the server app must handle the following HTTP requests and send back the appropriate HTTP response. Be mindful about responding to indices that don't exist in the database.

| Request Method | Request URL | Response Status | Response Content-Type | Response Body                                                                                              |
|----------------|-------------|-----------------|-----------------------|------------------------------------------------------------------------------------------------------------|
| `GET`          | `/pets`     | `200`           | `application/json`    | `[{ "age": 7, "kind": "rainbow", "name": "fido" }, { "age": 5, "kind": "snake", "name": "Buttons" }]` |
| `GET`          | `/pets/0`   | `200`           | `application/json`    | `{ "age": 7, "kind": "rainbow", "name": "fido" }`                                                     |
| `GET`          | `/pets/1`   | `200`           | `application/json`    | `{ "age": 5, "kind": "snake", "name": "Buttons" }`                                                         |
| `GET`          | `/pets/2`   | `404`           | `text/plain`          | `Not Found`                                                                                                |
| `GET`          | `/pets/-1`  | `404`           | `text/plain`          | `Not Found`                                                                                                |

Like before, start the HTTP server with `nodemon`.

```shell
nodemon expressServer.js
```

Open a new shell tab and use the `http` shell command to send HTTP requests to your server.

```shell
http GET localhost:8000/pets
```

Once you've successfully converted the server app to Express, check out the `master` branch.

```shell
git checkout master
```

Merge the feature branch into `master`.

```shell
git merge express_server
```

And delete the feature branch.

```shell
git br -d express_server
```

We have provided tests for you to check your work. In order for the tests to run, you will need to export your server so the tests can import it in using `require`. To export your server, simply write the following line at the bottom of the file:

```javascript
module.exports = app;
```

where `app` is the variable that is assigned the result from `express()`.

```shell
$ npm test test/expressServer.test.js
```

## Bonus

In future parts of this assignment, your server will need to handle create, update, and destroy HTTP commands. For now, add a route handler that responds to create commands by adding new pets to the database.

| Request Method | Request URL | Request Body                                            | Response Status | Response Content-Type | Response Body                                           |
|----------------|-------------|---------------------------------------------------------|-----------------|-----------------------|---------------------------------------------------------|
| `POST`         | `/pets`     | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` | `200`           | `application/json`    | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` |
| `GET`          | `/pets/3`   | N/A                                                     | `200`           | `application/json`    | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` |

You can send create commands to the server app with the following command

```shell
http POST localhost:8000/pets age=3 kind=parakeet name=Cornflake
```

If `age`, `kind`, or `name` are missing from the HTTP request body or `age` is not an integer, then the data must not be added to the database and the server must send back the follow HTTP response.

| Request Method | Request URL | Request Body                               | Response Status | Response Content-Type | Response Body |
|----------------|-------------|--------------------------------------------|-----------------|-----------------------|---------------|
| `POST`         | `/pets`     | `{ "name": "", "age": "two", "kind": "" }` | `400`           | `text/plain`          | `Bad Request` |
| `GET`          | `/pets/4`   | N/A                                        | `404`           | `text/plain`          | `Not Found`   |

## Bonus

Add [404 Not Found]['404'] middleware to handle all unknown HTTP requests and send an appropriate response.

| Request Method | Request URL | Response Status | Response Content-Type | Response Body |
|----------------|-------------|-----------------|-----------------------|---------------|
| `GET`          | `/`         | `404`           | `text/plain`          | `Not Found`   |
| `GET`          | `/blah`     | `404`           | `text/plain`          | `Not Found`   |

## Bonus

Add [500 Internal Server Error]['500'] middleware to handle all internal server errors and send an appropriate response. It may be helpful to test your error-handling middleware with a route handler that calls the `next()` function with a `new Error()`. See approach #2 in the [Node.js Error Handling]['error-handling'] guide for more details on how the `next()` function works in Express.

| Request Method | Request URL | Response Status | Response Content-Type | Response Body           |
|----------------|-------------|-----------------|-----------------------|-------------------------|
| `GET`          | `/boom`     | `500`           | `text/plain`          | `Internal Server Error` |

Once this is working, refactor your server's route handlers to call the `next()` function to handle all filesystem errors instead of using `throw`.

## Bonus Tests

We have provided tests for you to check your work specifically for the bonus. To run the command for this exercise, run the following command.

```shell
$ npm test test/expressServer.bonus.test.js
```

['404']: http://expressjs.com/en/starter/faq.html#how-do-i-handle-404-responses
['500']: http://expressjs.com/en/starter/faq.html#how-do-i-setup-an-error-handler
['airbnb']: https://www.npmjs.com/package/eslint-config-airbnb
['error-handling']: http://sahatyalkabov.com/jsrecipes/#!/backend/nodejs-error-handling
['ryansobol']: https://github.com/ryansobol/eslint-config-ryansobol#language-configuration
