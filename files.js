#!/usr/bin/env node
var fs = require('fs');
var nodePath = require('path');
var util = require("./util");

var files = module.exports = {
  /**
   * Returns the contents of the file at the given path as a string.
   * If the file does not exist, it returns undefined.
   *
   * @param path
   */
  read: function(path) {
    if (fs.existsSync(path)) {
      return fs.readFileSync(path, "utf8");
    }
  },
  /**
   * Returns a string by concatenating the given path to the absolute path of the .gitlet directory
   *
   * @param path
   */
  gitletPath: function(path) {
    function gitletDir(dir) {
      if (fs.existsSync(dir)) {
        var potentialConfigFile = nodePath.join(dir, 'config');
        var potentialGitletPath = nodePath.join(dir, '.gitlet');

        if (fs.existsSync(potentialConfigFile) &&
            fs.statSync(potentialConfigFile).isFile() &&
            files.read(potentialConfigFile).match(/\[core\]/)) {
          return dir;
        }
        else if (fs.existsSync(potentialGitletPath)) {
          return potentialGitletPath;
        }
        else if ("/" !== dir) {
          return gitletDir(nodePath.join(dir, ".."));
        }
      }

      var gitDir = gitletDir(process.cwd());
      if (gitDir !== undefined) {
        return nodePath.join(gitDir, path || "");
      }
    }
  },
  /**
   * Check if the current working directory is inside a repo
   *
   * @returns {boolean}
   */
  inRepo: function() {
    return files.gitletPath() !== undefined;
  },
  /**
   * Takes tree of files as a nested JS obj and writes those files to disk,
   * taking prefix as the root of the tree.
   * Tree syntax: { a: { b: { c: "filecontent" }}}
   *
   * @param tree
   * @param prefix
   */
  writeFilesFromTree: function(tree, prefix) {
    Object.keys(tree).forEach(function(name) {
      var path = nodePath.join(prefix, name);
      if (util.isString(tree[name])) {
        // End of the line - write contents
        fs.writeFileSync(path, tree[name]);
      }
      else {
        // Check that path exists and keep going
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, "777");
        }

        files.writeFilesFromTree(tree[name], path);
      }
    });
  }
};