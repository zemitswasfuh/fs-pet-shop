'use strict';

const { assert } = require('chai');
const fs = require('fs');
const { exec } = require('child_process');

const copyFile = function(source, target, cb) {
  let cbCalled = false;
  const rd = fs.createReadStream(source);
  const wr = fs.createWriteStream(target);
  const done = function(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  };

  rd.on('error', (err) => {
    done(err);
  });

  wr.on('error', (err) => {
    done(err);
  });

  wr.on('close', (_ex) => {
    done();
  });

  rd.pipe(wr);
};

describe('pets commandline tool bonus', () => {
  beforeEach((done) => {
    copyFile('pets.json', 'pets.json.old', (err) => {
      if (err) {
        return done(err);
      }

      const petsArr = [{
        age: 7,
        kind: 'rainbow',
        name: 'fido'
      }, {
        age: 4,
        kind: 'duck',
        name: 'Bob'
      }];

      fs.writeFile('pets.json', JSON.stringify(petsArr), done);
    });
  });

  afterEach((done) => {
    copyFile('pets.json.old', 'pets.json', (err) => {
      if (err) {
        return done(err);
      }

      fs.unlink('pets.json.old', done);
    });
  });

  describe('node pets.js update', () => {
    it('no args should error with usage instructions', (done) => {
      exec('node pets.js update', (err, _stdout, stderr) => {
        if (!err) {
          assert.fail('Command produced a zero status code',
            'Command should produce a nonzero status code');
        }

        const msg = 'Usage: node pets.js update INDEX AGE KIND NAME\n';

        assert.strictEqual(stderr, msg);
        done();
      });
    });

    it('one arg should error with usage instructions', (done) => {
      exec('node pets.js update 1', (err, _stdout, stderr) => {
        if (!err) {
          assert.fail('Command produced a zero status code',
            'Command should produce a nonzero status code');
        }

        const msg = 'Usage: node pets.js update INDEX AGE KIND NAME\n';

        assert.strictEqual(stderr, msg);
        done();
      });
    });

    it('two args should error with usage instructions', (done) => {
      exec('node pets.js update 1 9', (err, _stdout, stderr) => {
        if (!err) {
          assert.fail('Command produced a zero status code',
            'Command should produce a nonzero status code');
        }

        const msg = 'Usage: node pets.js update INDEX AGE KIND NAME\n';

        assert.strictEqual(stderr, msg);
        done();
      });
    });

    it('three args should error with usage instructions', (done) => {
      exec('node pets.js update 1 9 cat', (err, _stdout, stderr) => {
        if (!err) {
          assert.fail('Command produced a zero status code',
            'Command should produce a nonzero status code');
        }

        const msg = 'Usage: node pets.js update INDEX AGE KIND NAME\n';

        assert.strictEqual(stderr, msg);
        done();
      });
    });

    it('successfully updates a pet', (done) => {
      const check = function(callback) {
        return function(err, stdout, _stderr) {
          if (err) {
            assert.fail('Command produced a nonzero status code',
              'Command should produce a zero status code');
          }

          const msgs = [
            '{ age: 9, kind: \'cat\', name: \'Rosey\' }',
            ''
          ];

          assert.deepEqual(stdout.split(/\r?\n/), msgs);
          callback();
        };
      };

      exec('node pets.js update 1 9 cat Rosey', check(() => {
        exec('node pets.js read 1', check(done));
      }));
    });
  });

  describe('node pets.js destroy', () => {
    it('no args should error with usage instructions', (done) => {
      exec('node pets.js destroy', (err, _stdout, stderr) => {
        if (!err) {
          assert.fail('Command produced a zero status code',
            'Command should produce a nonzero status code');
        }

        const msg = 'Usage: node pets.js destroy INDEX\n';

        assert.strictEqual(stderr, msg);
        done();
      });
    });

    it('successfully destroys a pet', (done) => {
      const check = function(msgs, callback) {
        return function(err, stdout, _stderr) {
          if (err) {
            assert.fail('Command produced a nonzero status code',
              'Command should produce a zero status code');
          }

          assert.deepEqual(stdout.split(/\r?\n/), msgs);
          callback();
        };
      };

      exec('node pets.js destroy 1', check([
        '{ age: 4, kind: \'duck\', name: \'Bob\' }',
        ''
      ], () => {
        exec('node pets.js read', check([
          '[ { age: 7, kind: \'rainbow\', name: \'fido\' } ]',
          ''
        ], done));
      }));
    });
  });

  describe('with a shebang ./pets.js read', () => {
    it('should log the array', (done) => {
      exec('./pets.js read', (err, stdout, _stderr) => {
        if (err) {
          assert.fail('Command produced a nonzero status code',
            'Command should produce a zero status code');
        }

        const msgs = [
          '[ { age: 7, kind: \'rainbow\', name: \'fido\' },',
          '  { age: 4, kind: \'duck\', name: \'Bob\' } ]',
          ''
        ];

        assert.deepEqual(stdout.split(/\r?\n/), msgs);
        done();
      });
    });

    it('should read an item at index 0', (done) => {
      exec('./pets.js read 0', (err, stdout, _stderr) => {
        if (err) {
          assert.fail('Command produced a nonzero status code',
            'Command should produce a zero status code');
        }

        const msgs = [
          '{ age: 7, kind: \'rainbow\', name: \'fido\' }',
          ''
        ];

        assert.deepEqual(stdout.split(/\r?\n/), msgs);
        done();
      });
    });

    it('should read an item at index 1', (done) => {
      exec('./pets.js read 1', (err, stdout, _stderr) => {
        if (err) {
          assert.fail('Command produced a nonzero status code',
            'Command should produce a zero status code');
        }

        const msgs = [
          '{ age: 4, kind: \'duck\', name: \'Bob\' }',
          ''
        ];

        assert.deepEqual(stdout.split(/\r?\n/), msgs);
        done();
      });
    });
  });
});
