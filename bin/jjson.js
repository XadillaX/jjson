#! /usr/bin/env node
'use strict';

const fs = require('fs');

const jsonParser = require('jsonlint').parser;

const opts = require('nomnom')
  .option('file', {
    abbr: 'f',
    help: 'JSON filename.',
    required: true,
    callback: fn => {
      if (!fs.existsSync(fn)) {
        return 'file ' + fn + ' not exsits.';
      }
    },
  })
  .option('encoding', {
    abbr: 'e',
    help: 'JSON file encoding.',
    default: 'utf8',
  })
  .option('indent', {
    abbr: 'i',
    help: 'Number of indent for each line.',
    default: 2,
  })
  .script('jjson')
  .parse();

const filename = opts.file;

jsonParser.parseError = jsonParser.lexer.parseError = (str, hash) => {
  // Refer to @dfishburn's PR:
  //   https://github.com/XadillaX/jjson/pull/1
  const msg =
    `${filename},${hash.loc.first_line},${hash.loc.last_column},found: ` +
    `'${hash.token}' - expected: ${hash.expected.join(',')}.`;
  throw new Error(msg);
};

// eslint-disable-next-line node/prefer-promises/fs
fs.readFile(filename, { encoding: opts.encoding }, function(err, json) {
  if (err) {
    console.error(`Error occurred while reading file: ${err.message}`);
    process.exit(1);
  }

  try {
    jsonParser.parse(json);
  } catch (e) {
    console.error(`Error occurred while parsing file: ${e.message}`);
    process.exit(1);
  }

  try {
    json = JSON.stringify(JSON.parse(json), true, opts.indent);
  } catch (e) {
    console.error(`Error occurred while parsing file: ${e.message}`);
    process.exit(1);
  }

  console.log(json);
});
