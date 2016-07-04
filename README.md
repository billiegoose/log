# log
This may not be everyone's cup o' tea, but this is the library I've written for console.log-style debugging. Features include:
 - Timestamps (with optional timezone configuration)
 - Filename and line number of the caller
   - Gets correct line numbers for CoffeeScript (using [`coffee-errors`](https://www.npmjs.com/package/coffee-errors) module)
 - Colored log levels (using [`chalk`](https://www.npmjs.com/package/chalk) module)
 - Truncate long strings and arrays with ...
 - Pretty-prints Objects instead of printing [object Object]
 - Pretty-prints Error objects (using [`pretty-error`](https://www.npmjs.com/package/pretty-error) module)
   - prints long stack traces (using the [`stack-trace`](https://www.npmjs.com/package/stack-trace) and [`clarify`](https://www.npmjs.com/package/clarify) modules)
 - An EventEmitter interface so you can listen for log messages (say, to copy all messages to the Captain's log, or perform evasive manuvers on 'error' and 'fatal' messages)
 - 'filename' option to redirect logging to a file instead of stdout
 - 'quiet' option to turn off logging when its not desired.

# Usage
```js
// A single, global log object. Don't call with "new".
log = require('log')

// Calling setup is optional.
log.setup({
  filename: String   // optional, if specified writes to file instead of stdout
  quiet: Bool        // optional, default false, if true turns disables output but still triggers events
  timezone: String   // optional, defaults to "America/New_York" 
  colors: Bool       // optional, default is chalk's autodetect behavior
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
