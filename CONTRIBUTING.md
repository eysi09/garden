# Developing the Garden CLI framework

## Contributing guidelines

We heartily welcome any form of contribution to the project, including issue reports, feature requests,
discussion, pull requests and any type of feedback. We request that all contributors
adhere to the [Contributor Covenant](CODE_OF_CONDUCT.md) and work with us to make the collaboration and
community productive and fun for everyone :)

## Commit messages

We follow and automatically validate
[Angular-like formatting](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits) for our
commit messages, for consistency and clarity.

## Setting up your development environment

Start by cloning the repo.

For Mac we have a script that installs all required dependencies, mostly via Homebrew:

    ./bin/bootstrap-osx

Other platforms need to roll their own for now (contributions welcome!). Please have a look
at the script for Mac to see what's installed. Once dependencies are in place, all you need is:

    npm install
    lerna bootstrap

## Running a development version of the CLI

While developing the CLI, we recommend you run the dev command in your console:

    cd garden-service
    npm run dev

This will do an initial development build, `npm link` it to your global npm folder, and then watch for
changes and auto-rebuild as you code. You can then run the `garden` command as normal.

Also, you might like to add a couple of shorthands:

    alias g='garden'
    alias k='kubectl'

## Testing

Tests are run using `mocha`. To run the full test suite, including linting and other validation, simply run
from the root:

    npm test

### CI

We use [Circle CI](https://circleci.com) for integration testing. Sometimes
it can be useful to test and debug the CI build locally, particularly when
updating or adding dependencies. You can use their
[CLI](https://circleci.com/docs/2.0/local-jobs/) for that, which
is installed automatically by the `./bin/bootstrap-osx` script. Once you
have it installed you can run `circleci build` in the repo root to test
the build locally.

## License/copyright headers

Every source file must include the contents of `static/license-header.txt` at the top. This is
automatically checked during CI. You can run the check with `npm run check-licenses`.

## Release process

We use [Lerna](https://github.com/lerna/lerna) to automate the release process.
Install the latest version of lerna using `npm install -g -U lerna`.

Depending on what type of release you're making, you can use one of the following commands:

    # Publish a new release (e.g. 0.1.0, 0.2.0 etc. - we will use this most often).
    # This also automatically updates the changelog and our homebrew package.
    npm run release

    # Publish an alpha/canary release (e.g. 0.2.0-alpha.48f816f28).
    npm run release-canary

See more details about `lerna publish` [in their docs](https://github.com/lerna/lerna#publish).
