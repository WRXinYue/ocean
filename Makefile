PROJECT_NAME := ocean
BINARY_NAME := $(PROJECT_NAME)

GO := go

BUILD_DIR := ./bin

.PHONY: all build clean run

all: build	## Default target executed when no arguments are given to make.

swag:	## Target to initialize Swagger, a tool for designing, building, and documenting RESTful APIs.
	$(SWAG) init

build:	## Target to compile the source code.
	$(GO) build $(GOFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/server

clean:	## Target to clean the build directory.
	rm -rf $(BUILD_DIR)

run: build	## Target to run the compiled binary.
	$(BUILD_DIR)/$(BINARY_NAME)

help: ## print this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {gsub("\\\\n",sprintf("\n%22c",""), $$2);printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
