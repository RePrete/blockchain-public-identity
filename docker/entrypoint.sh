#!/bin/sh

yarn
yarn truffle compile
yarn truffle migrate
SKIP_PREFLIGHT_CHECK=true yarn start
