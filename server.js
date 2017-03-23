'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const {resolve} = require('path');
const PrettyError = require('pretty-error');
const finalHandler = require('finalhandler');
const runContainer = require('./docker/runContainer');
const session = require('express-session')
// PrettyError docs: https://www.npmjs.com/package/pretty-error
const Promise = require('bluebird');

const app = express();

//const containerId = '094b57f4215a';
const exec = Promise.promisify(require('child_process').exec);

// Pretty error prints errors all pretty.
const prettyError = new PrettyError();

// Skip events.js and http.js and similar core node files.
prettyError.skipNodeFiles()

// Skip all the trace lines about express' core and sub-modules.
prettyError.skipPackage('express')

module.exports = app
  // Body parsing middleware
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())

  // Serve static files from ../public
  .use(express.static(resolve(__dirname, 'public')))

  // Serve our api - ./api also requires in ../db, which syncs with our database
  // .use('/api', require('./api'))

  // express session
  .use(session({secret: '1234567890QWERTY'}))

  // adding userid to req.session
  .post('/setUser', (req, res, next) => {
      const userId = req.body.userId;
      req.session.userId = userId;
      console.log('req.session', req.session)
      res.sendStatus(200);
  })

  .post('/container', (req, res, next) => {
    const userId = req.body.userId;
    const userRoutes = req.body.userRoutes;
    const userModels = req.body.userModels;
    console.log('POSTING TO CONTAINER')
    runContainer(userId, 3001, 6542, userRoutes, userModels);
    // send res after docker compose up
    res.send('posted to container')
  })

  // run a get request in container terminal and receive the result
  .get('/containerTest', (req, res, next) => {
    // the container's name is the user id plus `app_docker-test_1`
    const userId = req.session.userId;
    const containerName = `${userId.toLowerCase()}app_docker-test_1`;
    console.log('container name', containerName);
    exec(`docker ps -aqf "name=${containerName}"`)
    .then( (containerId) => {
      return exec('docker exec ' + containerId.trim() + ' curl http://localhost:8080/test');
    })
    .then((result) => {
      res.send(result);
    })
    .catch(console.error);
  })



  // run a post request in container terminal and receive result
  // docker container id is hardcoded in, might need to be changed when running bc container id can change
  // .get('/containerPostTest', (req, res, next) => {
  //   const containerId = '094b57f4215a';
  //   const exec = Promise.promisify(require('child_process').exec);

  //   exec(`docker exec ${containerId} curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"name":"ada"}' http://localhost:8080/test2`)
  //   .then((result) => {
  //     res.send(result);
  //   })
  //   .catch(console.error);
  // })


    .get('/containerPostTest', (req, res, next) => {
        const containerName = `${userId}app_docker-test_1`;
        exec(`docker ps -aqf "name=${containerName}"`)
        .then( (containerId) => {
            console.log("CONTAINER ID IS:", containerId);
            exec(`docker exec ${containerId} curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"name":"ada"}' http://localhost:8080/test2`)
        })
        .then((result) => {
            res.send(result);
        })
        .catch(console.error);
    })

  // Send index.html for anything else.
  .get('/*', (_, res) => res.sendFile(resolve(__dirname, 'public', 'index.html')))

  // Error middleware interceptor, delegates to same handler Express uses.
  // https://github.com/expressjs/express/blob/master/lib/application.js#L162
  // https://github.com/pillarjs/finalhandler/blob/master/index.js#L172
  .use((err, req, res, next) => {
    console.error(prettyError.render(err))
    finalHandler(req, res)(err)
  })

const server = app.listen(
  3000,
  () => {
    console.log(`--- Started HTTP Server ---`);
    const { address, port } = server.address();
    const host = address === '::' ? 'localhost' : address;
    const urlSafeHost = host.includes(':') ? `[${host}]` : host;
    console.log(`Listening on http://${urlSafeHost}:${port}`);
  }
)

