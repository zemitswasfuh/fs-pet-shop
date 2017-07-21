'use strict';

const request = require('supertest');
const rewire = require('rewire');

// Set the port to a different number so that it does not conflict with the
// other test files.
process.env.PORT = 3002;
const app = rewire('../httpServer');

describe('pets bonus httpServer', () => {
  beforeEach(() => {
    let petsArr = [{
      age: 7,
      kind: 'rainbow',
      name: 'Fido'
    }, {
      age: 4,
      kind: 'duck',
      name: 'Bob'
    }];

    app.__set__({
      'fs': {
        readFile: function(path, encoding, cb){
          if(/pets.json$/.test(path)) return cb(null,JSON.stringify(petsArr));
          cb(new Error('File does not exist'));
        },
        writeFile: function(path, data, cb){
          if(/pets.json$/.test(path)){
            petsArr = JSON.parse(data);
            return cb(null);
          }
          return cb(new Error('File does not exist'));
        }
      }
    });
  });

  describe('catch all route handler', () => {
    it('should return a 404 when requesting the root route', (done) => {
      request(app)
        .get('/')
        .expect('Content-Type', /text\/plain/)
        .expect(404, 'Not Found', done);
    });

    it('should return a 404 when resource doesn\'t exist', (done) => {
      request(app)
        .get('/blah')
        .expect('Content-Type', /text\/plain/)
        .expect(404, 'Not Found', done);
    });
  });

  describe('POST method', () => {
    it('should update pets.json when given a valid pet object', (done) => {
      request(app)
        .post('/pets')
        .send({
          age: 2,
          kind: 'owl',
          name: 'Hugo'
        })
        .expect('Content-Type', /json/)
        .expect(200, {
          age: 2,
          kind: 'owl',
          name: 'Hugo'
        }, (err, _res) => {
          if (err) {
            return done(err);
          }

          request(app)
            .get('/pets/2')
            .expect('Content-Type', /json/)
            .expect(200, {
              age: 2,
              kind: 'owl',
              name: 'Hugo'
            }, done);
        });
    });
  });

  it('should respond with a 400 status code for invalid data', (done) => {
    request(app)
      .post('/pets')
      .send({
        age: 'two',
        kind: '',
        name: ''
      })
      .expect('Content-type', /text\/plain/)
      .expect(400, 'Bad Request', done);
  });
});
