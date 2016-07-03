sinon = require 'sinon'
Chalk = require 'chalk'
chalk = new Chalk.constructor({enabled: true})
log = require '..'

describe 'log', ->
  before ->
    log.setup(quiet: false, timezone: 'UTC')

  tests =
    [
      { "name": "single string"
      , "args": ["This is a test"]
      }
    ,
      { "name": "multiple strings"
      , "args": ["This is a test", "of more features", "and stuff"]
      }
    ,
      { "name": "single object"
      , "args": [{"key": "value"}]
      }
    ]
  # tests = [tests[0]]

  for level in ['log', 'debug', 'info', 'warn', 'err', 'fatal']
    for test in tests

      it "#{level} #{test.name}", ->
        write_spy = sinon.stub(process.stdout, 'write')
        clock = sinon.useFakeTimers(1000*(60*32+19)) # A nice-looking time, 12:32:19 AM
        try
          event_spy = sinon.spy()
          log.on level, event_spy
          # This space intentionally left blank
          #
          #
          #
          #
          #
          # The desired line # is 42
          log[level] test.args...
          time_stamp = switch level
            when 'log'   then chalk.gray('12:32:19 AM (log.coffee:42)\n')
            when 'debug' then chalk.gray('12:32:19 AM (log.coffee:42)\n')
            when 'info'  then chalk.blue('12:32:19 AM (log.coffee:42)\n')
            when 'warn'  then chalk.bold.yellow('12:32:19 AM (log.coffee:42)\n')
            when 'err'   then chalk.red('12:32:19 AM (log.coffee:42)\n')
            when 'fatal' then chalk.bgRed('12:32:19 AM (log.coffee:42)\n')
        finally
          write_spy.restore()
          clock.restore()
          log.removeListener level, event_spy
        sinon.assert.calledOnce(event_spy)
        sinon.assert.calledWith(write_spy, time_stamp)

  after ->
    log.setup(quiet: true)
