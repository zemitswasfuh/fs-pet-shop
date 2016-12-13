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

describe('pets commandline tool', () => {
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

  describe('node pets.js', () => {
    it('should error with usage instructions', (done) => {
      exec('node pets.js', (err, _stdout, stderr) => {
        if (!err) {
          assert.fail('Command produced a zero status code',
            'Command should produce a nonzero status code');
        }

        const msg = 'Usage: node pets.js [read | create | update | destroy]\n';

        assert.strictEqual(stderr, msg);
        done();
      });
    });
  });

  describe('node pets.js read', () => {
    it('should log the array', (done) => {
      exec('node pets.js read', (err, stdout, _stderr) => {
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
      exec('node pets.js read 0', (err, stdout, _stderr) => {
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
      exec('node pets.js read 1', (err, stdout, _stderr) => {
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

  describe('node pets.js create', () => {
    it('no args should error with usage instructions', (done) => {
      exec('node pets.js create', (err, _stdout, stderr) => {
        if (!err) {
          assert.fail('Command produced a zero status code',
            'Command should produce a nonzero status code');
        }

        const msg = 'Usage: node pets.js create AGE KIND NAME\n';

        assert.strictEqual(stderr, msg);
        done();
      });
    });

    it('one arg should error with usage instructions', (done) => {
      exec('node pets.js create 3', (err, _stdout, stderr) => {
        if (!err) {
          assert.fail('Command produced a zero status code',
            'Command should produce a nonzero status code');
        }

        const msg = 'Usage: node pets.js create AGE KIND NAME\n';

        assert.strictEqual(stderr, msg);
        done();
      });
    });

    it('two args should error with usage instructions', (done) => {
      exec('node pets.js create 3 parakeet', (err, _stdout, stderr) => {
        if (!err) {
          assert.fail('Command produced a zero status code',
            'Command should produce a nonzero status code');
        }

        const msg = 'Usage: node pets.js create AGE KIND NAME\n';

        assert.strictEqual(stderr, msg);
        done();
      });
    });

    it('successfully create a pet', (done) => {
      const check = function(callback) {
        return function(err, stdout, _stderr) {
          if (err) {
            assert.fail('Command produced a nonzero status code',
              'Command should produce a zero status code');
          }

          const msgs = [
            '{ age: 3, kind: \'parakeet\', name: \'Cornflake\' }',
            ''
          ];

          assert.deepEqual(stdout.split(/\r?\n/), msgs);
          callback();
        };
      };

      exec('node pets.js create 3 parakeet Cornflake', check(() => {
        exec('node pets.js read 2', check(done));
      }));
    });
  });
});
