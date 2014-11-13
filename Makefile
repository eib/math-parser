CD=$(shell pwd)
MOCHA=$(CD)/node_modules/.bin/mocha
MOCHA_REPORTER ?= dot

all: build test

build:
	# Nothing to build, yet.

test:
	# Running tests...
	$(MOCHA) --reporter $(MOCHA_REPORTER)
	# Done.

watch:
	# Test watcher
	$(MOCHA) --reporter $(MOCHA_REPORTER) --watch

.PHONY: all build test watch
