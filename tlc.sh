#!/bin/bash

if [[ ! -z $@ ]]; then
    echo Command line args are: "$@"
fi

# Uncomment to init the Node DEBUG mode
### node --inspect=127.0.0.1:9229 --inspect-brk ./server/server.js $@
node ./server/server.js "$@"