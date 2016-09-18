'use strict';

const request = require('supertest');
const mockFS = require('mock-fs');

// Set the port to a different number so that it does not conflict with the
// other test files.
process.env.PORT = 3004;
const app = require('../expressServer');

describe('pets bonus expressServer', () => {
  beforeEach(() => {
    const petsArr = [{
      age: 7,
      kind: 'rainbow',
      name: 'fido'
    }, {
      age: 4,
      kind: 'duck',
      name: 'Bob'
    }];

    mockFS({
      'pets.json': JSON.stringify(petsArr)
    });
  });

  afterEach(() => {
    mockFS.restore();
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
        .expect('Content-type', /json/)
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

    it('should respond with a 400 status code for invalid data', (done) => {
      request(app)
        .post('/pets')
        .send({
          age: 'two',
          kind: '',
          name: ''
        })
        .expect('Content-type', /text\/plain/)
        .expect(400, done);
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
});
