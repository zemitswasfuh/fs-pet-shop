'use strict';

const request = require('supertest');
const mockFS = require('mock-fs');

// Set the port to a different number so that it does not conflict with the
// other test files.
process.env.PORT = 3006;
const app = require('../restfulExpressServer');

describe('pets bonus restfulExpressServer', () => {
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

  describe('catch all route handler', () => {
    it('should return a 404 when requesting the root route', (done) => {
      request(app)
        .get('/')
        .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
        .expect('Content-Type', /text\/plain/)
        .expect(404, 'Not Found', done);
    });

    it('should return a 404 when resource doesn\'t exist', (done) => {
      request(app)
        .get('/blah')
        .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
        .expect('Content-Type', /text\/plain/)
        .expect(404, 'Not Found', done);
    });
  });

  describe('Support Basic Authentication', () => {
    it('Responds with a 401 for all unauthorized requests', (done) => {
      request(app)
        .get('/pets')
        .expect('Content-Type', /text\/plain/)
        .expect('WWW-Authenticate', /Basic realm="Required"/)
        .expect(401, 'Unauthorized', done);
    });

    it('Responds with a 200 for all authorized requests', (done) => {
      request(app)
        .get('/pets')
        .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
        .expect('Content-type', /json/)
        .expect(200, [{
          age: 7,
          kind: 'rainbow',
          name: 'fido'
        }, {
          age: 4,
          kind: 'duck',
          name: 'Bob'
        }], done);
    });
  });
});
