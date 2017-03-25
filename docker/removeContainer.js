const Promise = require('bluebird');

const removeContainer = (userId) => {
  const exec = Promise.promisify(require('child_process').exec);
  const currentDirectory = process.cwd();

  // if use app folder was made and currently in user app folder
  if (currentDirectory.includes(userId)) {
    console.log('docker compose down');
    exec('docker-compose down')
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
  }
}

module.exports = removeContainer;
