#!/usr/bin/env node

var util = module.exports = {
    /**
     * Checks if param is a string
     *
     * @param param
     */
    isString: function (param) {
        return typeof param === 'string';
    },
    /**
     * Returns the hash of a string
     *
     * @param param
     */
    hash: function (param) {
        // First, calculate a hashSum
        var hashSum = 0;
        for (var i = 0; i < param.length; i++) {
            hashSum = hashSum * 31 + param.charCodeAt(i);
            // bitwise OR
            hashSum = hashSum | 0;
        }

        // Return the hash sum as a hex string
        return Math.abs(hashSum).toString(16);
    },
    /**
     * I can't explain it in words. Example:
     *  setIn({}, ["a", "b", "me"]); // => { a: { b: "me" } }
     *
     * @param obj
     * @param arr
     */
    setIn: function (obj, arr) {
        if (arr.length === 2) {
            obj[arr[0]] = arr[1];
        }
        else {
            obj[arr[0]] = obj[arr[0]] || {};
            util.setIn(obj[arr[0]], arr.slice(1));
        }

        return obj;
    },
    /**
     * Get the non-empty lines in a string
     *
     * @param str
     */
    lines: function(str) {
        return str.split("\n").filter(function(l) { return "" !== l; });
    },
    /**
     * Flatten an array
     *
     * @param arr
     */
    flatten: function(arr) {
        return arr.reduce(function(a, element) {
            return a.concat(element instanceof Array ? util.flatten(element) : element);
        }, []);
    },
    /**
     * Get the unique elements in an array
     *
     * @param arr
     */
    unique: function(arr) {
        return arr.reduce(function(result, current) {
            return result.indexOf(current) === -1 ? result.concat(current) : result;
            // if (result.indexOf(current) === -1) {
            //     result.push(current);
            // }
            //
            // return result;
        }, []);
    },
    /**
     * Compute the intersection of arrays
     *
     * @param a
     * @param b
     */
    intersection: function(a, b) {
        return a.filter(function(e) { return b.indexOf(e) !== -1; });
    },
    /**
     * Execute a command on a remote repo
     *
     * @param remotePath
     * @returns {Function}
     */
    onRemote: function(remotePath) {
        return function(fn) {
            var originalDir = process.cwd();
            process.chdir(remotePath);

            var result = fn.apply(null, Array.prototype.slice.call(arguments, 1));
            process.chdir(originalDir);

            return result;
        };
    }
};