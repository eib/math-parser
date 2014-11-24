CD=$(shell pwd)
GULP=$(CD)/node_modules/.bin/gulp

all: build test

build:
	# Nothing to build, yet.

debug:
	node-debug _mocha

test:
	# Running tests...
	$(GULP) tests
	# Done.

watch:
	# Test watcher
	$(GULP) watch

.PHONY: all build test watch
