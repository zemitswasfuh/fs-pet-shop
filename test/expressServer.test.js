const
  should = require('should'),
  app = require('../expressServer'),
  request = require('supertest')(app);

describe('pets expressServer', function() {
  describe('GET /pets', function() {
    it('should return an array of pets', function(done) {
      request
        .get('/pets')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res, err) {
          if(err) return done(err);
          res.body.should.deepEqual([{ "age": 7, "kind": "rainbow", "name": "fido" }, { "age": 5, "kind": "snake", "name": "Buttons" }]);
        })
        .expect(200, done);
    });
  });
  describe('GET /pets/:id', function() {
    it('should return a pet at index 0', function(done) {
      request
        .get('/pets/0')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res, err) {
          if(err) return done(err);
          res.body.should.deepEqual({ "age": 7, "kind": "rainbow", "name": "fido" });
        })
        .expect(200, done);
    });
    it('should return a pet at index 1', function(done) {
      request
        .get('/pets/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res, err) {
          if(err) return done(err);
          res.body.should.deepEqual({ "age": 5, "kind": "snake", "name": "Buttons" });
        })
        .expect(200, done);
    });
    it('shouldn\'t return a pet at index 2', function(done) {
      request
        .get('/pets/2')
        .expect('Content-Type', /text\/plain/)
        .expect(function(res, err) {
          if(err) return done(err);
          res.text.should.equal('Not Found');
        })
        .expect(404, done);
    });
    it('shouldn\'t return a pet at index -1', function(done) {
      request
        .get('/pets/-1')
        .expect('Content-Type', /text\/plain/)
        .expect(function(res, err) {
          if(err) return done(err);
          res.text.should.equal('Not Found');
        })
        .expect(404, done);
    });
  });
});
