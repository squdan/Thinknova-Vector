#!/usr/bin/env bash

# Until gulp is added.
rm -rf ./dist
mkdir -p ./dist
browserify index.js --standalone edbFactory > ./dist/eris-db.js