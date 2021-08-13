#!/bin/sh

yarn
yarn truffle compile
yarn truffle migrate
NODE_ENV=development SKIP_PREFLIGHT_CHECK=true yarn start
