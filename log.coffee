require 'clarify'
stackTrace = require 'stack-trace'
try
  require 'coffee-errors'
PrettyError = require('pretty-error')
pe = new PrettyError()
pe.skipNodeFiles()
pe.skipPackage('coffee-script')
{EventEmitter} = require 'events'
path = require 'path'
Chalk = require 'chalk'
chalk = new Chalk.constructor({enabled: true})
moment = require 'moment-timezone'
fs = require 'fs'

settings = {}

write = (text) ->
  # Default write function
  if settings.quiet
    return
  else if settings.filename?
    fs.appendFileSync(settings.filename, text, 'utf8')
  else
    process.stdout.write text

emoji = (event) ->
  return '' if not settings.emoji
  switch event
    when 'log'   then '[log] ' #'✎'
    when 'info'  then '[info] ' #'ℹ'
    when 'warn'  then '[warn] ' #'⚠'
    when 'debug' then '[debug] ' #'📣'
    when 'err'   then '[error] ' #'🚫'
    when 'fatal' then '[fatal] '
    else '[unknown] '

replacer = (key, value) ->
  if value? and value.length > 250 # must at least be 36 to print full UUID
    return value[0..50] + ' ... '
  if typeof value is 'function'
    return "function #{value.toString().match(/\(.*\)/)[0]}"
  if value instanceof Error
    return pe.render(value)
  return value

class Log extends EventEmitter

  _log: (event, colorizer, args) ->
    time = moment().format('LTS')
    err = new Error 'stack me'
    trace = stackTrace.parse(err)
    filePath = trace[2].getFileName()
    lineNumber = trace[2].getLineNumber()
    fileline = path.basename( filePath ) + ':' + lineNumber
    this.emit(event, {caller: trace, time: time, args: args})

    write colorizer("#{emoji(event)}#{time} (#{fileline})\n")
    for arg in args
      # TODO: Given this, and 'replacer', clearly we should give up on JSON.stringify and
      # use a more powerful JS serialization library at this point.
      if arg instanceof Error
        write pe.render(arg)
      else if typeof arg is "undefined"
        write 'undefined' + '\n'
      else
        write (JSON.stringify(arg, replacer, 2) || arg.toString()) + '\n'

  setup: (opts) ->
    settings.filename = opts.filename
    settings.quiet = opts.quiet
    settings.timezone = opts.timezone || "America/New_York"
    moment.tz.setDefault(settings.timezone)
    if opts.colors?
      if opts.colors
        chalk.enabled = true
      else
        chalk.enabled = false

  log: (args...) ->
    this._log('log', chalk.gray, args)

  debug: (args...) ->
    this._log('debug', chalk.gray, args)

  info: (args...) ->
    this._log('info', chalk.blue, args)

  warn: (args...) ->
    this._log('warn', chalk.bold.yellow, args)

  err: (args...) ->
    this._log('err', chalk.red, args)

  error: (args...) ->
    this._log('err', chalk.red, args)

  fatal: (args...) ->
    this._log('fatal', chalk.bgRed, args)

  inject: ->
    for method in ['log', 'debug', 'info', 'warn', 'err', 'fatal', 'error']
      console[method] = this[method].bind(this)

LogSingleton = new Log

module.exports = LogSingleton
