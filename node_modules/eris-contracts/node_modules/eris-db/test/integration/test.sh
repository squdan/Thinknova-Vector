#!/bin/sh

# Build a test environment for integration tests in a Docker container and run them.

docker build --tag test .
docker run --interactive --tty --rm --volume=$PWD/../..:/usr/src/app test
