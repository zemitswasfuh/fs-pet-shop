# RESTful Express HTTP server

![pet-shop](https://i.imgur.com/oZFSFYq.jpg)

Now that you've converted your Node HTTP server to Express, the final hurdle is to add route handlers for creating, updating, and destroying records in the database.

## Getting started

Change into the project directory.

```shell
$ cd path/to/project
```

Create and switch to a new feature branch.

```shell
$ git checkout -b restful_express_routes
```
In order for our application to be able to process json we need to add app.use(express.json()) to our restfulExpressServer.js
Add this after you define the app instance. 

```
app.use(express.json());
```
# Assignment Part 1

Your next task is to create a RESTful Express HTTP server called `restfulExpressServer.js` to handle the create, update, and destroy HTTP commands. The route handlers must translate their respective command into an appropriate action that manages the records in the database. Once the database action is complete, the route handlers must send back an appropriate HTTP response.

| Request Method | Request URL | Request Body                                            | Response Status | Response Content-Type | Response Body                                           |
| -------------- | ----------- | ------------------------------------------------------- | --------------- | --------------------- | ------------------------------------------------------- |
| `POST`         | `/pets`     | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` | `200`           | `application/json`    | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` |
| `GET`          | `/pets/3`   | N/A                                                     | `200`           | `application/json`    | `{ "name": "Cornflake", "age": 3, "kind": "parakeet" }` |
| `PATCH`        | `/pets/3`   | `{ "name": "Fido" }`                                    | `200`           | `application/json`    | `{ "name": "Fido", "age": 3, "kind": "parakeet" }`      |
| `GET`          | `/pets/3`   | N/A                                                     | `200`           | `application/json`    | `{ "name": "Fido", "age": 3, "kind": "parakeet" }`      |
| `DELETE`       | `/pets/3`   | N/A                                                     | `200`           | `application/json`    | `{ "name": "Fido", "age": 3, "kind": "parakeet" }`      |
| `GET`          | `/pets/3`   | N/A                                                     | `404`           | `text/plain`          | `Not Found`                                             |

**NOTE:** The `PATCH` route handler must only update the record if `age` is an integer, if `kind` is not missing, or if `name` is not missing.

Like before, start the HTTP server with `nodemon`.

```shell
$ nodemon server.js
```

Open a new shell tab and use the `http` shell command to send HTTP requests to your server.

```shell
$ http POST localhost:8000/pets age=3 kind=parakeet name=Cornflake
```

**Alternatively you can use [Postman](https://www.postman.com/) to test your routes, this is a great tool. When you visit the site, look for the download app link and download the appropriate version for your operating system.**

When handling the `POST` HTTP request method, if `age`, `kind`, or `name` are missing from the HTTP request body or `age` is not an integer, then the data must not be added to the database and the server must send back the follow HTTP response.

| Request Method | Request URL | Request Body                               | Response Status | Response Content-Type | Response Body |
| -------------- | ----------- | ------------------------------------------ | --------------- | --------------------- | ------------- | --- |
| `POST`         | `/pets`     | `{ "name": "", "age": "two", "kind": "" }` | `400`           | `text/plain`          | `Bad Request` |     |

Once you've successfully added these route handlers, check out the `master` branch.

```shell
$ git checkout master
```

Merge the feature branch into `master`.

```shell
$ git merge restful_express_routes
```

And delete the feature branch.

```shell
$ git br -d restful_express_routes
```

Add [404 Not Found]['404'] middleware to handle all unknown HTTP requests and send an appropriate response.

| Request Method | Request URL | Response Status | Response Content-Type | Response Body |
| -------------- | ----------- | --------------- | --------------------- | ------------- |
| `GET`          | `/`         | `404`           | `text/plain`          | `Not Found`   |
| `GET`          | `/blah`     | `404`           | `text/plain`          | `Not Found`   |

# Assignment Part 2

**Re-work your server so that it connects to a RDBMS (e.g. Postgres or MySQL) and queries that database in each route instead of a JSON file**

This will require you to create a new database, build out the table(s), install certain dependencies using `npm`, and tell the server to connect to the database before you can run queries in each route.

## Bonus

Add [500 Internal Server Error]['500'] middleware to handle all internal server errors and send an appropriate response. It may be helpful to test your error-handling middleware with a route handler that calls the `next()` function with a `new Error()`. See approach #2 in the [Node.js Error Handling]['error-handling'] guide for more details on how the `next()` function works in Express.

| Request Method | Request URL | Response Status | Response Content-Type | Response Body           |
| -------------- | ----------- | --------------- | --------------------- | ----------------------- |
| `GET`          | `/boom`     | `500`           | `text/plain`          | `Internal Server Error` |

Once this is working, refactor your server's route handlers to call the `next()` function to handle all filesystem errors instead of using `throw`.

## Bonus

Add [basic access authentication]['auth'] middleware to protect all routes from unauthorized access. In other words, the middleware must send the following HTTP response for all unauthorized HTTP requests.

| Response Status | Response Content-Type | Response WWW-Authenticate | Response Body  |
| --------------- | --------------------- | ------------------------- | -------------- |
| `401`           | `text/plain`          | `Basic realm="Required"`  | `Unauthorized` |

To make an authorized HTTP request, the user must specify the correct credentials such as a name of `admin` and a password of `meowmix`. The client will then encode the credentials and include them in the `Authorization` header of the HTTP request.

| Request Method | Request URL | Request Authorization        |
| -------------- | ----------- | ---------------------------- |
| `GET`          | `/pets`     | `Basic YWRtaW46bWVvd21peA==` |

Here's an example of making an unauthorized HTTP request.

```shell
$ http -v GET localhost:8000/pets
GET /pets HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Connection: keep-alive
Host: localhost:8000
User-Agent: HTTPie/0.9.3



HTTP/1.1 401 Unauthorized
Connection: keep-alive
Content-Length: 12
Content-Type: text/plain; charset=utf-8
Date: Thu, 24 Mar 2016 13:33:33 GMT
ETag: W/"c-4G0bpw8TMen5oRPML4h9Pw"
WWW-Authenticate: Basic realm="Required"

Unauthorized
```

And here's an example of making an authorized HTTP request.

```shell
$ http -v --auth admin:meowmix GET localhost:8000/pets
GET /pets HTTP/1.1
Accept: */*
Accept-Encoding: gzip, deflate
Authorization: Basic YWRtaW46bWVvd21peA==
Connection: keep-alive
Host: localhost:8000
User-Agent: HTTPie/0.9.3



HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 84
Content-Type: application/json; charset=utf-8
Date: Thu, 24 Mar 2016 13:33:53 GMT
ETag: W/"54-D2Au1DrDyt59Q+wXwR4adQ"

[
    {
        "age": 7,
        "kind": "rainbow",
        "name": "fido"
    },
    {
        "age": 5,
        "kind": "snake",
        "name": "Buttons"
    }
]
```

['404']: http://expressjs.com/en/starter/faq.html#how-do-i-handle-404-responses
['500']: http://expressjs.com/en/starter/faq.html#how-do-i-setup-an-error-handler
['auth']: https://en.wikipedia.org/wiki/Basic_access_authentication
['error-handling']: http://sahatyalkabov.com/jsrecipes/#!/backend/nodejs-error-handling
