# Gitlet

Follows [Mary Rose Cook's gitlet.js](http://gitlet.maryrosecook.com/docs/gitlet.html)

This is a follow-along of gitlet.js. Where possible, I explain/annotate code
in a way that makes sense to me. Some variable names have been changed inside
of module methods.

The order of commits attempts to retain a functional gitlet command, so
the first commands are geared to getting `gitlet init` up and running.

`gitlet.js` is great, but the cognitive load of the entire source is too much
 for me so I broke it up into modules (the modules just contain the objects
 that RMC originally wrote, but by splitting it I can write functions as they
 are needed, instead of writing the entire file at once which would be akin
 to copy/paste).

## Installing with Yarn

There's only one dependency for the project `jasmine-node`, for testing.
Trying `npm install --save jasmine-node` on Windows failed after a few
minutes and some thousands of files/directories.

`yarn add --dev jasmine-node` took less than 3.5 seconds to complete.
