# log
This may not be everyone's cup o' tea, but this is the library I've written for console.log-style debugging.

## Improvements over `console.log`
 - **Timestamps** (with optional timezone configuration)
 - **Filename and line number** of the caller
   - **CoffeeScript** files have correct line numbers too (using [`coffee-errors`](https://www.npmjs.com/package/coffee-errors))
 - **Colored** log levels (using [`chalk`](https://www.npmjs.com/package/chalk))
 - **Objects and arrays** are pretty-printed using JSON.stringify instead of `[object Object]`
 - **Error** objects are pretty printed (using [`pretty-error`](https://www.npmjs.com/package/pretty-error))
   - **Long stack traces** included (using the [`stack-trace`](https://www.npmjs.com/package/stack-trace) and [`clarify`](https://www.npmjs.com/package/clarify))
 - **Smart truncation** of long strings and arrays
 - **'quiet'** option to quickly turn logging off/on
 - **'filename'** option to write directly to a file instead of stdout
 - **EventEmitter** interface so you can listen for log messages (say, to copy all messages to the Captain's log, or perform evasive manuvers on 'error' and 'fatal' messages)

# Usage
```js
// A single, global log object. Don't call with "new".
log = require('log')

// Calling setup is optional.
log.setup({
  filename: String   // optional, if specified writes to file instead of stdout (has precedence over `stdout`)
  quiet: Bool        // optional, default false, if true turns disables output but still triggers events
  timezone: String   // optional, defaults to "America/New_York"
  colors: Bool       // optional, default is chalk's autodetect behavior
  stdout: Stream     // optional, if specified log writes to a Writable Stream instead of process.stdout (since v1.1.0)
  cutoffLength: Number // optional, default 250, the length to truncate long strings (since v1.1.0)
})

// Available log methods
log.log(args...)
log.debug(args...)
log.info(args...)
log.warn(args...)
log.err(args...)
log.fatal(args...)

// Event listener example(s)
log.on('err', function(e) {
  // Print errors to stderr
  process.stderr.write('ERROR: ' + e.message)
})
log.once('fatal', function(e) {
  // Take 'fatal' errors literally
  process.exit(1)
})
```

# Example output
Screenshot of the colorized log levels, using Solarized terminal color scheme:

![capture](https://cloud.githubusercontent.com/assets/587740/16549013/03c57abc-4168-11e6-890b-6f0b72001c5f.PNG)

Example of a pretty error stack:

![image](https://cloud.githubusercontent.com/assets/587740/16549085/e64500d8-4168-11e6-8db3-c04a266bbed1.png)
