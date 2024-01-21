SNIPPETS_BASE_URL?=https://cdevoogd.github.io/snippets/
SNIPPETS_DEV_PORT?=3300

.DEFAULT_GOAL := help
.PHONY: help
help: ## List out the Makefile's targets and their descriptions
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: build
build: ## Build the site from the current repository
	hugo  --gc --minify --baseURL $(SNIPPETS_BASE_URL)

.PHONY: dev
dev: ## Start a local development server of the site
	hugo server --baseURL http://localhost --port $(SNIPPETS_DEV_PORT) --logLevel debug --disableFastRender
