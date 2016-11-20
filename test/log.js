"use strict"
const sinon = require('sinon')
const Chalk = require('chalk')
const chalk = new Chalk.constructor({
  enabled: true
})
const log = require('..')
const stream = require('stream')

describe('log', function () {

  const tests = [
    {
      'name': 'single string',
      'args': ['This is a test']
    }, {
      'name': 'multiple strings',
      'args': ['This is a test', 'of more features', 'and stuff']
    }, {
      'name': 'single object',
      'args': [
        {
          'key': 'value'
        }
      ]
    }
  ]

  const levels = ['log', 'debug', 'info', 'warn', 'err', 'fatal']

  const timestamps = {
    'log': chalk.gray('12:32:19 AM (log.js:56)\n'),
    'debug': chalk.gray('12:32:19 AM (log.js:56)\n'),
    'info': chalk.blue('12:32:19 AM (log.js:56)\n'),
    'warn': chalk.bold.yellow('12:32:19 AM (log.js:56)\n'),
    'err': chalk.red('12:32:19 AM (log.js:56)\n'),
    'fatal': chalk.bgRed('12:32:19 AM (log.js:56)\n'),
  }

  for (let level of levels) {
    for (let test of tests) {
      it(level + ' ' + test.name, function () {
        let stdout = new stream.Writable()
        let write_spy = sinon.stub(stdout, 'write')
        let clock = sinon.useFakeTimers(1000 * (60 * 32 + 19))
        let event_spy = sinon.spy()
        let time_stamp = timestamps[level]
        log.setup({
          quiet: false,
          timezone: 'UTC',
          colors: true,
          stdout: stdout,
        })
        try {
          log.on(level, event_spy)
          log[level].apply(log, test.args)
        } finally {
          write_spy.restore()
          clock.restore()
          log.removeListener(level, event_spy)
        }
        sinon.assert.calledOnce(event_spy)
        sinon.assert.calledWith(write_spy, time_stamp)
      })
    }
  }
})
