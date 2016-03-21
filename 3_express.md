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

Ignore `node_modules` from the repository.

```shell
echo 'node_modules' >> .gitignore
```

## Assignment

Your task is to convert the Node HTTP server you built yesterday into an Express HTTP server. As before, the server app must handle the following HTTP requests and send back the appropriate HTTP response. Be mindful about responding to indices that don't exist in the database.

| Request Method | Request URL | Response Status | Response Content-Type | Response Body                                                                                              |
|----------------|-------------|-----------------|-----------------------|------------------------------------------------------------------------------------------------------------|
| `GET`          | `/pets`     | `200`           | `application/json`    | `[{ "age": 7, "kind": "rainbow", "name": "Lil Chris" }, { "age": 5, "kind": "snake", "name": "Buttons" }]` |
| `GET`          | `/pets/0`   | `200`           | `application/json`    | `{ "age": 7, "kind": "rainbow", "name": "Lil Chris" }`                                                     |
| `GET`          | `/pets/1`   | `200`           | `application/json`    | `{ "age": 5, "kind": "snake", "name": "Buttons" }`                                                         |
| `GET`          | `/pets/2`   | `404`           | `text/plain`          | `Not found`                                                                                                |
| `GET`          | `/pets/-1`  | `404`           | `text/plain`          | `Not found`                                                                                                |

Like before, start the HTTP server with `nodemon`.

```shell
nodemon server.js
```

Open a new shell tab and use the `http` shell command to send HTTP requests to your server.

```shell
http http://localhost:5000/pets
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

## Bonus

In future parts of this assignment, your server will need to handle create, update, and destroy HTTP commands. For now, add a route handler that responds to create commands by adding new pets to the database.

| Request Method | Request URL | Request Body                                            | Response Status | Response Content-Type | Response Body                                           |
|----------------|-------------|---------------------------------------------------------|-----------------|-----------------------|---------------------------------------------------------|
| `POST`         | `/pets`     | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` | `200`           | `application/json`    | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` |
| `GET`          | `/pets/3`   | N/A                                                     | `200`           | `application/json`    | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` |

You can send create commands to the server app with the following command

```shell
http POST http://localhost:5000/pets age=3 kind=parakeet name=Cornflake
```

If `age`, `kind`, or `name` are missing from the HTTP request body or `age` is not an integer, then the data must not be added to the database and the server must send back the follow HTTP response.

| Request Method | Request URL | Request Body                               | Response Status | Response Content-Type | Response Body |
|----------------|-------------|--------------------------------------------|-----------------|-----------------------|---------------|
| `POST`         | `/pets`     | `{ "name": "", "age": "two", "kind": "" }` | `400`           | `text/plain`          | `Bad Request` |
| `GET`          | `/pets/4`   | N/A                                        | `404`           | `text/plain`          | `Not Found`   |

## Bonus

Convert the code in your `server.js` file into ES6 syntax. It may be helpful to use linting rules to assist in the conversion.

- [`eslint-config-airbnb`]['airbnb']
- [`eslint-config-ryansobol`]['ryansobol']

## Bonus

Add a catch all route handler for unknown HTTP requests and send the appropriate response.

| Request Method | Request URL | Response Status | Response Content-Type | Response Body |
|----------------|-------------|-----------------|-----------------------|---------------|
| `GET`          | `/`         | `404`           | `text/plain`          | `Not found`   |
| `GET`          | `/blah`     | `404`           | `text/plain`          | `Not found`   |

## Bonus

Add [middleware]['500'] to handle all internal server errors and send an appropriate response. It may be helpful to test your error-handling middleware with a route handler that calls the `next()` function with a `new Error()`. See approach #2 in the [Node.js Error Handling]['error-handling'] guide for more details on how the `next()` function works in Express.

| Request Method | Request URL | Response Status | Response Content-Type | Response Body           |
|----------------|-------------|-----------------|-----------------------|-------------------------|
| `GET`          | `/boom`     | `500`           | `text/plain`          | `Internal Server Error` |

Once this is working, refactor your server's route handlers to call the `next()` function to handle all filesystem errors.


['404']: http://expressjs.com/en/starter/faq.html#how-do-i-handle-404-responses
['500']: http://expressjs.com/en/starter/faq.html#how-do-i-setup-an-error-handler
['airbnb']: https://www.npmjs.com/package/eslint-config-airbnb
['error-handling']: http://sahatyalkabov.com/jsrecipes/#!/backend/nodejs-error-handling
['ryansobol']: https://github.com/ryansobol/eslint-config-ryansobol#language-configuration
