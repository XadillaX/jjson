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
fs.readFile(filename, opts.encoding, function(err, json) {
    if(err) {
        return console.error("Error occurred while reading file: " + err.message);
    }
    var orig = json;
    var jsonlint;
    var error;
    try {
        // Test if jsonlint is installed
        jsonlint = require("jsonlint");
        // console.log('jsonlint loaded');

        try {
            var jsonlint_parser = require("jsonlint").parser;
            // console.log('jsonlint parser loaded');
            // Specify a compact output to open with Vim's 
            // quickfix / location window to go directly to
            // the line where the errors are.
            jsonlint_parser.parseError = jsonlint_parser.lexer.parseError = function(str, hash) {
                // console.error(filename + ': line '+ hash.loc.first_line +', col '+ hash.loc.last_column +', found: \''+ hash.token +'\' - expected: '+ hash.expected.join(', ') +'.');
                //error = (filename + ': line '+ hash.loc.first_line +', col '+ hash.loc.last_column +', found: \''+ hash.token +'\' - expected: '+ hash.expected.join(', ') +'.');
                error = (filename + ','+ hash.loc.first_line +','+ hash.loc.last_column +',found: \''+ hash.token +'\' - expected: '+ hash.expected.join(', ') +'.');
                throw new Error(error);
                //throw new Error(str);
            };
            //console.log('jsonlint parser parsed OK');
            json = jsonlint_parser.parse(json);
        } catch(e) {
            // console.log('jsonlint parser output:'+json);
            // console.log('jsonlint parser catch:'+e);
            //if(opts["vim-plugin-mode"]) return console.log(orig);
            //return console.error("Error occurred while parsing file: " + e.message);
            //console.log(e.message);
            console.log("Error occurred while parsing file: " + e.message);
            process.exit(1);
        }
    }
    catch( e ) {
        if ( e.code === 'MODULE_NOT_FOUND' ) {
            // The module hasn't been installed.
            // Do not use jsonlint to validate the JSON
            // before formatting it.
            // console.log("\njsonlint is not installed");
        }
    }

    try {
        json = JSON.stringify(JSON.parse(json), true, opts.indent);
    } catch(e) {
        // console.log('JSON output:'+json);
        // console.log('JSON catch:'+e);
        //if(opts["vim-plugin-mode"]) return console.log(orig);
        //console.error("Error occurred while parsing file: " + e.message + "\nJSON:" + JSON.stringify(json));
        console.error("Error occurred while parsing file: " + e.message);
        process.exit(1);
    }

    console.log(json);
});

