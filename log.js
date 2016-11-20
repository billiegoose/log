"use strict"
require('clarify')
const stackTrace = require('stack-trace')
try {
  require('coffee-errors')
} finally {
}
const EventEmitter = require('events').EventEmitter
const path = require('path')
const Chalk = require('chalk')
const chalk = new Chalk.constructor({enabled: true})
const moment = require('moment-timezone')
const fs = require('fs')
const prettyprint = require('./lib/prettyprint')

let settings = {
  stdout: process.stdout,
  quiet: false,
  timezone: "America/New_York",
  cutoffLength: 250,
}

function write (text) {
  // Default write function
  if (settings.quiet) {
    return
  } else if (settings.filename) {
    fs.appendFileSync(settings.filename, text, 'utf8')
  } else {
    settings.stdout.write(text)
  }
}

let eventEmoji = {
  'log'   : '[log] ',
  'info'  : '[info] ',
  'warn'  : '[warn] ',
  'debug' : '[debug] ',
  'err'   : '[error] ',
  'fatal' : '[fatal] ',
}

function emoji (event) {
  let icon = eventEmoji[event] || '[unknown] '
  return (settings.emoji) ? icon : ''
}

function _log (event, colorizer, args) {
  let time = moment().format('LTS')
  let err = new Error('stack me')
  let trace = stackTrace.parse(err)
  let filePath = trace[2].getFileName()
  let lineNumber = trace[2].getLineNumber()
  let fileline = path.basename( filePath ) + ':' + lineNumber
  Log.emit(event, {caller: trace, time: time, args: args})

  write(colorizer(`${emoji(event)}${time} (${fileline})\n`))
  for (let arg of args) {
    write(prettyprint(arg))
  }
}

const Log = new EventEmitter

Log.setup = (opts) => {
  Object.assign(settings, opts)
  moment.tz.setDefault(settings.timezone)
  if (settings.hasOwnProperty('colors')) {
    chalk.enabled = settings.colors
  }
}

Log.log = (...args) => _log('log', chalk.gray, args)

Log.debug = (...args) => _log('debug', chalk.gray, args)

Log.info = (...args) => _log('info', chalk.blue, args)

Log.warn = (...args) => _log('warn', chalk.bold.yellow, args)

Log.err = (...args) => _log('err', chalk.red, args)

Log.error = (...args) => _log('err', chalk.red, args)

Log.fatal = (...args) => _log('fatal', chalk.bgRed, args)


module.exports = Log
