#! /usr/bin/env node
/**
 * XadillaX created at 2014-08-22 13:00:30
 *
 * Copyright (c) 2014 Death Moon's Gensokyo, all rights
 * reserved
 */
var fs = require("fs");
var opts = require("nomnom").option("file", {
    abbr    : "f",
    help    : "JSON filename.",
    required: true,
    callback: function(fn) {
        if(!fs.existsSync(fn)) return "file " + fn + " not exsits.";
    }
}).option("encoding", {
    abbr    : "e",
    help    : "JSON file encoding.",
    default : "utf8"
}).option("indent", {
    abbr    : "i",
    help    : "Number of indent for each line.",
    default : 2
}).option("vim-plugin-mode", {
    abbr    : "v",
    help    : "Whether it's in VIM plugin mode.",
    flag    : true
}).script("jjson").parse();

var filename = opts.file;
fs.readFile(filename, { encoding: opts.encoding }, function(err, json) {
    if(err) {
        return console.error("Error occurred while reading file: " + err.message);
    }

    var orig = json;
    try {
        json = JSON.stringify(JSON.parse(json), true, opts.indent);
    } catch(e) {
        if(opts["vim-plugin-mode"]) return console.log(orig);
        return console.error("Error occurred while parsing file: " + e.message);
    }

    console.log(json);
});

