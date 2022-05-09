#!/usr/bin/env node
const fs = require('fs-extra')
const commandLineArgs = require('command-line-args')
const shuffler = require('./src/Shuffler')
const pkg = require('./package.json')

const optionDefinitions = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean
  },
  {
    name: 'shuffle',
    alias: 's',
    type: Boolean
  },
  {
    name: 'verify',
    alias: 'v',
    type: String,
    multiple: true
  }
]

function error(message) {
  if (!Array.isArray(message)) {
    message = [message]
  }
  console.error(message[0])
  if (message[1]) {
    console.info(message[1])
  }
  /*eslint-disable-next-line*/
  process.exit(1)
}

let options = {}
try {
  options = commandLineArgs(optionDefinitions, {
    camelCase: true
  })
} catch (e) {
  error(e.message)
}

options.isCLI = true

console.info(`Metadata Manager v${pkg.version}`)

if (options.help) {
  console.info(`${pkg.description}

Options:
  -h, --help             This help.
  -s, --shuffle          Starts the shuffle of the metadata
  -v, --verify           Verifies that a PNG file is consistent with its imageSha256 attribute
`)
  // eslint-disable-next-line no-process-exit
  process.exit(0)
}

shuffler.run(options)
    .then(() => process.exit(0))
    .catch(e => {
      console.error(e.message)
      process.exit(1)
    })

