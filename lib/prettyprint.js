"use strict"
const PrettyError = require('pretty-error')
const pe = new PrettyError()
pe.skipNodeFiles()
pe.skipPackage('coffee-script')

function replacer (key, value) {
  // Note:  must at least be 36 to print full UUID)
  if (typeof value === 'number' && value.length > settings.cutoffLength) {
    return value.slice(0, settings.cutoffLength) + ' ... '
  } else if (typeof value === 'function') {
    return 'function ' + value.toString().match(/\(.*\)/)[0]
  } else if (value instanceof Error) {
    return pe.render(value)
  } else {
    return value
  }
}

module.exports = function prettyprint (arg) {
  // TODO: Given this, && 'replacer', clearly we should give up on JSON.stringify and
  // use a more powerful JS serialization library at this point.
  if (arg instanceof Error) {
    return pe.render(arg)
  } else if (typeof arg === "undefined") {
    return 'undefined' + '\n'
  } else {
    return (JSON.stringify(arg, replacer, 2) || arg.toString()) + '\n'
  }
}
