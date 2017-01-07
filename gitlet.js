#!/usr/bin/env node

var files = require('./files');
var config = require('./config');

var gitlet = module.exports = {
  /**
   * Initialize the current directory as a new repo
   *
   * @param opts
   */
  init: function(opts) {
    if (files.inRepo()) {
      return;
    }

    opts = opts || {};

    var gitletStructure = {
        HEAD: "ref: refs/heads/master\n",
        config: config.objToStr({core: {"": {bare: opts.bare === true}}}),
        objects: {},
        refs: {
            heads: {}
        }
    };

    files.writeFilesFromTree(opts.bare ? gitletStructure : {".gitlet": gitletStructure},
      process.cwd());
  }
};

// Parse the process.argv object. Return a map of options to be used with the gitlet command
var parseOptions = function(argv) {
  var name;

  return argv.reduce(function(opts, arg) {
    if (arg.match(/^-/)) {
      name = arg.replace(/^-+/, "");
      opts[name] = true;
    }
    else if (typeof name !== 'undefined') {
      opts[name] = arg;
      name = undefined;
    }
    else {
      opts._.push(arg);
    }

    return opts;
  }, {
    _:[]
  });
};

// Responsible for processing CLI input
var runCli = module.exports.runCli = function(argv) {
  var opts = parseOptions(argv);
  var commandName = opts._[2];

  if (typeof commandName === 'undefined') {
    throw new Error("Specify a gitlet command to run.");
  }
  else {
    var commandFnName = commandName.replace(/-/g, "_");
    var fn = gitlet[commandFnName];

    if (typeof fn === 'undefined') {
      throw new Error("'" + commandFnName + "' is not a gitlet command (yet!).");
    }
    else {
      var commandArgs = opts._.slice(3);
      while (commandArgs.length < fn.length - 1) {
        commandArgs.push(undefined);
      }
      console.log("You called " + commandFnName + "! Here are the options you passed:");
      console.log(commandArgs.concat(opts));
      // Call the gitlet command, while passing gitlet as the value for `this`
      return fn.apply(gitlet, commandArgs.concat(opts));
    }
  }
};

if (require.main == module) {
  try {
    var result = runCli(process.argv);
    if (typeof result !== 'undefined') {
      console.log(result);
    }
  } catch(e) {
    console.error(e.toString());
  }
}