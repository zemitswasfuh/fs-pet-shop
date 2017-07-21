'use strict';

const rewire = require('rewire');
const request = require('supertest');

// Set the port to a different number so that it does not conflict with the
// other test files.
process.env.PORT = 3001;
const app = rewire('../httpServer');

describe('pets httpServer', () => {
  beforeEach(() => {
    const petsArr = [{
      age: 7,
      kind: 'rainbow',
      name: 'Fido'
    }, {
      age: 5,
      kind: 'snake',
      name: 'Buttons'
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



  describe('GET /pets', () => {
    it('should return an array of pets', (done) => {
      request(app)
        .get('/pets')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, [{
          age: 7,
          kind: 'rainbow',
          name: 'Fido'
        }, {
          age: 5,
          kind: 'snake',
          name: 'Buttons'
        }], done);
    });
  });

  describe('GET /pets/:id', () => {
    it('should return a pet at index 0', (done) => {
      request(app)
        .get('/pets/0')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          age: 7,
          kind: 'rainbow',
          name: 'Fido'
        }, done);
    });

    it('should return a pet at index 1', (done) => {
      request(app)
        .get('/pets/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          age: 5,
          kind: 'snake',
          name: 'Buttons'
        }, done);
    });

    it('shouldn\'t return a pet at index 2', (done) => {
      request(app)
        .get('/pets/2')
        .expect('Content-Type', /text\/plain/)
        .expect('Content-Type', /text\/plain/)
        .expect(404, 'Not Found', done);
    });

    it('shouldn\'t return a pet at index -1', (done) => {
      request(app)
        .get('/pets/-1')
        .expect('Content-Type', /text\/plain/)
        .expect('Content-Type', /text\/plain/)
        .expect(404, 'Not Found', done);
    });
  });
});
