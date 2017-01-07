#!/usr/bin/env node

var util = require("./util");
var files = require("./files");
/**
 * Allows the .gitlet/config to be read and written
 */
var config = module.exports = {
  /**
   * Serialize the config string (contents of .gitlet/config) into a nested JS object, and return the object
   *
   * @param str
   * @returns string
   */
  strToObj: function (str) {
    return str.split("[")
      .map(function (item) {
        return item.trim();
      })
      .filter(function (item) {
        return "" !== item;
      })
      .reduce(function (c, item) {
        /**
         * Example:
         * [core]
         * filemode = false
         * bare = false
         */
        var lines = item.split("\n");
        var entry = [];

        entry.push(lines[0].match(/([^ \]]+)( |\])/)[1]);

        var subsectionMatch = lines[0].match(/\"(.+)\"/);
        var subsection = null === subsectionMatch ? "" : subsectionMatch[1];
        entry.push(subsection);

        entry.push(lines.slice(1).reduce(function (s, l) {
          s[l.split("=")[0].trim()] = l.split("=")[1].trim();

          return s;
        }, {}));

      });
  },
  read: function () {
    return config.strToObj(files.read(files.gitletPath("config")));
  },
  /**
   * Stringifies the config object (serialized contents of .gitlet/config),
   * and return the string
   *
   * @param obj
   * @returns {string}
   */
  objToStr: function (obj) {
    return Object.keys(obj)
      .reduce(function (arr, section) {
        return arr.concat(
          Object.keys(obj[section])
            .map(function (subsection) {return {section: section, subsection: subsection}})
        );
      }, [])
      .map(function (entry) {
        var subsection = "" === entry.subsection ? "" : " \"" + entry.subsection + "\"";
        var settings = obj[entry.section][entry.subsection];
        return "[" + entry.section + subsection + "]\n" +
          Object.keys(settings)
            .map(function (k) { return " " + k + " = " + settings[k]; })
            .join("\n") + "\n";
      })
      .join("");
  },
  /**
   * Returns true if the repo is bare
   */
  isBare: function () {
    return config.read()
  }
};