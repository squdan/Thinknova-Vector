'use strict';

var
  child_process = require('child_process'),
  Promise = require('bluebird'),
  untildify = require('untildify');

Promise.promisifyAll(child_process);

function exec(command) {
  return child_process.execAsync(command, {encoding: 'utf8'})
    .then(function (stdout) {
      return stdout.trim();
    });
}

// Create a fresh chain for each integration test.  Return its IP address and
// validator.
module.exports = function () {
  var
    hostname, stdout, port;

  return Promise.join(
    exec('docker-machine ip').catchReturn('localhost'),

    exec('\
      eris chains rm --data --force blockchain; \
      \
      [ -d ~/.eris/chains/blockchain ] || (eris services start keys \
        && eris chains make blockchain --chain-type=simplechain) \
      \
      && eris chains new --dir=blockchain --api --publish blockchain \
      && eris chains start blockchain \
      && sleep 3 \
      && eris chains inspect blockchain NetworkSettings.Ports'),

    function (hostname, stdout) {
      try {
        port = /1337\/tcp:\[{0.0.0.0 (\d+)}\]/.exec(stdout)[1];
      } catch (exception) {
        console.error("Unable to retrieve IP address of test chain.  Perhaps \
it's stopped; check its logs.");

        process.exit(1);
      }

      console.log("Created Eris DB test server listening at " + hostname + ":"
        + port + ".");

      return [hostname, port,
        require(untildify('~/.eris/chains/blockchain/priv_validator.json'))
      ];
    });
};
