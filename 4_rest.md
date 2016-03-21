# RESTful Express HTTP server

![pet-shop](https://i.imgur.com/oZFSFYq.jpg)

Now that you've converted your Node HTTP server to Express, the final hurdle is to add route handlers for creating, updating, and destroying records in the database.

## Getting started

Change into the project directory.

```shell
cd path/to/project
```

Create and switch to a new feature branch.

```shell
git checkout -b express_routes
```

Install `body-parser` and `morgan` as a dependencies.

```shell
npm install --save body-parser
npm install --save morgan
```

## Assignment

Your first task is to wire up `body-parser` and `morgan` as middleware to your express app. They will greatly help you with the rest of the assignment.

Your next task is to add routes to handle the create, update, and destroy HTTP commands. The route handlers must translate their respective command into an appropriate action that manages the records in the database. Once the database action is complete, the route handlers must send back an appropriate HTTP response.

| Request Method | Request URL | Request Body                                            | Response Status | Response Content-Type | Response Body                                           |
|----------------|-------------|---------------------------------------------------------|-----------------|-----------------------|---------------------------------------------------------|
| `POST`         | `/pets`     | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` | `200`           | `application/json`    | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` |
| `GET`          | `/pets/3`   | N/A                                                     | `200`           | `application/json`    | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` |
| `PUT`          | `/pets/3`   | `{ "name": "Scooter", "age": 4, "kind": "puppy" }`      | `200`           | `application/json`    | `{ "name": "Scooter", "age": 4, "kind": "puppy" }`      |
| `GET`          | `/pets/3`   | N/A                                                     | `200`           | `application/json`    | `{ "name": "Scooter", "age": 4, "kind": "puppy" }`      |
| `DELETE`       | `/pets/3`   | N/A                                                     | `200`           | `application/json`    | `{ "name": "Scooter", "age": 4, "kind": "puppy" }`      |
| `GET`          | `/pets/3`   | N/A                                                     | `404`           | `text/plain`          | `Not Found`                                             |

Like before, start the HTTP server with `nodemon`.

```shell
nodemon server.js
```

Open a new shell tab and use the `http` shell command to send HTTP requests to your server.

```shell
http POST http://localhost:5000/pets age=3 kind=parakeet name=Cornflake
```

When handling the `POST` and `PUT` HTTP request methods, if `age`, `kind`, or `name` are missing from the HTTP request body or `age` is not an integer, then the data must not be added to the database and the server must send back the follow HTTP response.

| Request Method | Request URL | Request Body                               | Response Status | Response Content-Type | Response Body                                      |
|----------------|-------------|--------------------------------------------|-----------------|-----------------------|----------------------------------------------------|
| `POST`         | `/pets`     | `{ "name": "", "age": "two", "kind": "" }` | `400`           | `text/plain`          | `Bad Request`                                      |
| `GET`          | `/pets/4`   | N/A                                        | `404`           | `text/plain`          | `Not Found`                                        |
| `PUT`          | `/pets/1`   | `{ "name": "", "age": "two", "kind": "" }` | `400`           | `text/plain`          | `Bad Request`                                      |
| `GET`          | `/pets/1`   | N/A                                        | `200`           | `application/json`    | `{ "age": 5, "kind": "snake", "name": "Buttons" }` |

Once you've successfully added these route handlers, check out the `master` branch.

```shell
git checkout master
```

Merge the feature branch into `master`.

```shell
git merge express_routes
```

And delete the feature branch.

```shell
git br -d express_routes
```

## Bonus

Add a route to handle the `PATCH` HTTP request method. The `PATCH` method issues a command to partially update a record in the database.

| Request Method | Request URL | Request Body         | Response Status | Response Content-Type | Response Body                                   |
|----------------|-------------|----------------------|-----------------|-----------------------|-------------------------------------------------|
| `PATCH`        | `/pets/3`   | `{ "name": "Fido" }` | `200`           | `application/json`    | `{ "name": "Fido", "age": 4, "kind": "puppy" }` |
| `GET`          | `/pets/3`   | N/A                  | `200`           | `application/json`    | `{ "name": "Fido", "age": 4, "kind": "puppy" }` |

The route handler must only update the record if `age` is an integer, if `kind` is not missing, or if `name` is not missing.

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
