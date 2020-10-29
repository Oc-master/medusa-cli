#!/usr/bin/env node
const { program } = require('commander');
const package = require('../package.json');
const CreateCommand = require('../src/commands/create_command');
const addCommand = require('../src/commands/add_command');

program
  .version(package.version, '-v, --version', 'display version for medusa-cli')
  .usage('<command> [options]')

program
  .option('-i, --ignore', 'ignore all the question')

program
  .command('create <projectName>')
  .description('create a medusa template project')
  .option('-i, --ignore', 'ignore checking to see if the folder exists')
  .action((source, destination) => {
    new CreateCommand(source, destination);
  })

program
  .command('add <name>')
  .description('add page or component')
  .action((source) => {
    addCommand(source);
  })

try {
  program.parse(process.argv);
} catch (error) {
  console.log('error: ', error);
}
