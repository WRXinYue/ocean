PROJECT_NAME := ocean
BINARY_NAME := $(PROJECT_NAME)

GO := go

BUILD_DIR := ./bin

.PHONY: all build clean run

all: build

swag:
	$(SWAG) init

build:
	$(GO) build $(GOFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/server

clean:
	rm -rf $(BUILD_DIR)

run: build
	$(BUILD_DIR)/$(BINARY_NAME)