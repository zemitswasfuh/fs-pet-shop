'use strict';

const request = require('supertest');
const mockFS = require('mock-fs');

// Set the port to a different number so that it does not conflict with the
// other test files.
process.env.PORT = 3005;
const app = require('../restfulExpressServer');

describe('pets restfulExpressServer', () => {
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

  describe('GET /pets', () => {
    it('should return an array', (done) => {
      request(app)
        .get('/pets')
        .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
        .expect('Content-Type', /json/)
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

  describe('GET /pets/:id', () => {
    it('should return a single pet', (done) => {
      request(app)
        .get('/pets/1')
        .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
        .expect('Content-Type', /json/)
        .expect(200, {
          age: 4,
          kind: 'duck',
          name: 'Bob'
        }, done);
    });

    it('should return a 404 for nonexistent index/pet', (done) => {
      request(app)
        .get('/pets/7')
        .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
        .expect('Content-Type', /text\/plain/)
        .expect(404, 'Not Found', done);
    });

    it('should return a 404 for invalid input', (done) => {
      request(app)
        .get('/pets/-1')
        .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
        .expect('Content-Type', /text\/plain/)
        .expect(404, 'Not Found', done);
    });
  });

  describe('POST method', () => {
    it('should update pets.json when given a valid pet object', (done) => {
      request(app)
        .post('/pets')
        .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
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
            .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
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
        .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
        .send({
          age: 'two',
          kind: '',
          name: ''
        })
        .expect('Content-type', /text\/plain/)
        .expect(400, 'Bad Request', done);
    });
  });

  describe('PATCH method', () => {
    it('should update pets.json when given a complete pet object', (done) => {
      request(app)
        .patch('/pets/1')
        .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
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
            .get('/pets/1')
            .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
            .expect('Content-Type', /json/)
            .expect(200, {
              age: 2,
              kind: 'owl',
              name: 'Hugo'
            }, done);
        });
    });

    it('should update pets.json when given an incomplete pet object', (done) => {
      request(app)
        .patch('/pets/1')
        .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
        .send({
          age: 3
        })
        .expect('Content-type', /json/)
        .expect(200, {
          age: 3,
          kind: 'duck',
          name: 'Bob'
        }, (err, _res) => {
          if (err) {
            return done(err);
          }

          request(app)
            .get('/pets/1')
            .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
            .expect('Content-Type', /json/)
            .expect(200, {
              age: 3,
              kind: 'duck',
              name: 'Bob'
            }, done);
        });
    });
  });

  describe('DELETE method', () => {
    it('should remove a pet from pets.json', (done) => {
      request(app)
        .del('/pets/1')
        .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
        .expect('Content-type', /json/)
        .expect(200, {
          age: 4,
          kind: 'duck',
          name: 'Bob'
        }, (err, _res) => {
          if (err) {
            return done(err);
          }

          request(app)
            .get('/pets/1')
            .set('Authorization', 'Basic YWRtaW46bWVvd21peA==')
            .expect('Content-Type', /text\/plain/)
            .expect(404, 'Not Found', done);
        });
    });
  });
});
