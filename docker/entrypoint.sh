#!/bin/sh

cd /app
apk add git
yarn
SKIP_PREFLIGHT_CHECK=true yarn start
