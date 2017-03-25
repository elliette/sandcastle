const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const dockerComposeStr = `db:
  image: postgres
  ports:
    - <%= postgresPort %>:5432
  environment:
    POSTGRES_USER: username
    POSTGRES_PASSWORD: pgpassword
    POSTGRES_DB: docker-test
docker-test:
  build: .
  ports:
    - <%= serverPort %>:8080
  links:
    - db
  environment:
    SEQ_DB: docker-test
    SEQ_USER: username
    SEQ_PW: pgpassword
    PORT: 8080
    DATABASE_URL: postgres://username:pgpassword@db:5432/docker-test`;

const runContainer = (userId, serverPort, postgresPort, userRoutes, userModels) => {
    const dockerCompose = _.template(dockerComposeStr);
    const exec = Promise.promisify(require('child_process').exec);
    const writeFile = Promise.promisify(fs.writeFile);
    const readFile = Promise.promisify(fs.readFile);

    console.log(`DIRECTORY WHEN RUN BACKEND BUTTON CLICKED: ${process.cwd()}`);

    // currently in text-editor folder
    exec(`pwd`)
    // create user app folder in docker folder
    // include timestamp in folder in future if time
    .then((currentDirectory) => {
        // if user app folder already exista and already inside use app folder
        if (currentDirectory.includes(`${userId}-app`)) {
            console.log('THERE IS ALREADY A USER APP')

            console.log('docker compose down');
            return exec('docker-compose down')
            .then(() => {
                // change into docker folder and delete user app folder
                process.chdir('../');
                console.log(`Changed working directory: ${process.cwd()}`);
                console.log('deleting user-app folder');
                return exec(`rm -r ${userId}-app`);
            })
            .then(() => {
                // change into text-editor folder
                process.chdir('../');
                console.log(`Changed working directory: ${process.cwd()}`);
            })
            .then(() => {
                return exec(`mkdir docker/${userId}-app`);
            })
            .catch(console.error);

        } else {
        // if user app folder does not exist and inside text editor folder
            console.log('NO USER APP FOLDER YET');
            return exec(`mkdir docker/${userId}-app`);
        }
    })
    .then(() => {
        //change into user app folder
        try {
          console.log(`Current working directory: ${process.cwd()}`);
          process.chdir(`docker/${userId}-app`);
          console.log(`Changed working directory: ${process.cwd()}`);
        }
        catch (err) {
          console.log(`chdir: ${err}`);
        }
        // check that we can do docker-compose down and delete user-app folder
        // in future run this in separate function when user reload their app on frontend
        // setTimeout(() => {
        //     console.log('timeout, docker compose down');
        //     exec('docker-compose down')
        //     .then(() => {
        //         process.chdir('../');
        //         console.log(`Changed working directory: ${process.cwd()}`);
        //         console.log('deleting user-app folder');
        //         exec(`rm -r ${userId}-app`);
        //     })
        //     .then(() => {
        //         process.chdir('../');
        //         console.log(`Changed working directory: ${process.cwd()}`);
        //     })
        //     .catch(console.error);
        // }, 60000);

        console.log("reading package.json");
        return readFile(path.join(__dirname,'./package.json'), 'utf8')
    })
    .then( (userPackageJson) => {
        console.log('creating a package.json');
        return writeFile('package.json', userPackageJson);
    })
    .then(() => {
        console.log("reading user server");
        return readFile(path.join(__dirname,'./userServer.js'), 'utf8')
    })
    .then((userServer) => {
        // write user server to user-app folder
        console.log('creating the server');
        return writeFile('userServer.js', userServer);
    })
    .then(() => {
        // write user models to user-app folder
        console.log('creating the user models');
        return writeFile('userModels.js', userModels);
    })
    .then(() => {
        // write user routes to user-app folder
        console.log('creating the user routes');
        return writeFile('userRoutes.js', userRoutes);
    })
    .then(() => {
        // write docker-compose to user-app folder
        return writeFile('docker-compose.yml', dockerCompose({'serverPort': serverPort, 'postgresPort': postgresPort}));
    })
    .then(() => {
        console.log("reading Dockerfile");
        return readFile(path.join(__dirname,'./Dockerfile'), 'utf8')
    })
    .then((dockerFile) => {
        // write dockerFile to user-app folder
        console.log('creating docker file');
        return writeFile('Dockerfile', dockerFile);
    })
    .then(() => {
        // build docker container
        console.log('building docker container')
        return exec('docker-compose build');
    })
    .then(() => {
        // run docker container
        console.log('running docker-compose up');
        return new Promise(function (resolve, reject) {
            // might not need stdio?
            const runningProcess = require('child_process').spawn('docker-compose', ['up'], {stdio: ['pipe', 'pipe', 'pipe']});
            // console.log('stdin', runningProcess.stdin);
            runningProcess.stdout.on('data', v => {
                const dockerTerminalOutput = v.toString();
                console.log(dockerTerminalOutput);
                // when container server runs, listen for the 'Running container server' output from docker terminal
                // if (dockerTerminalOutput.includes('Running container server')) {
                //     console.log('=====sdfsfdfsf=======')
                // }
            });
            runningProcess.stderr.on('data', e => {
                console.log(e.toString());
            });
            runningProcess.on('exit', statusCode => {
                console.log('status code', statusCode);
                return statusCode === 0 ? resolve() : reject();
            });
        });
    })
    .catch(console.error);
};

module.exports = runContainer;
