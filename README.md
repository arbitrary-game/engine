# Arbitrary Game

## Installation

* [Install Node.js](https://nodejs.org/en/download/)
* [Install Meteor](https://www.meteor.com/install)
* [Install Yarn](https://yarnpkg.com/en/docs/install)
* `yarn global add json`
* `git clone THIS_REPO_URL arbitrary-game`
* `cd arbitrary-game`
* `git submodule update --init --recursive`
* `meteor npm install -g yarn` # switching to yarn for dependency management
* `meteor yarn install`
* Symlink settings ([ask Denis Gorbachev](mailto:denis.d.gorbachev@gmail.com))
* `./bin/reset` (reset the project, reload fixtures)
* [Enable faster rebuilds](https://github.com/meteor/docs/blob/version-NEXT/long-form/file-change-watcher-efficiency.md)

## Testing

It's a good idea to run tests right after installation to ensure everything works.

* `./bin/test dev` # run unit tests
* `./bin/test dev --full-app` # run full app tests

Test report is available at [http://localhost:4000/](http://localhost:4000/).

More information: [Meteor testing guide](https://guide.meteor.com/testing.html).

## Development

* Use mobile-first approach: switch your browser into "iPhone 5" mode. 
