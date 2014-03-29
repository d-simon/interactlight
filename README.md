#InteractLight Documentation

This is the documentation repository of the [InteractLight](https://github.com/d-simon/interactlight) project.

View the [Documentation](http://d-simon.github.io/interactlight)


## Getting Started
This project equires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide.

### SASS

You will need the ruby gem sass (you might have to sudo)
```shell
gem install sass
```
A more in-depth guide can be found here http://sass-lang.com/install

### Build & Dev

**Develop locally**
```shell
grunt server
```
This will open a watch task (with livereload) and recompile SASS and reload the page in your browser on file changes. You open the page at http://0.0.0.0:9001

**Develop with direct production preview**
```shell
grunt server:build
```
This will do very much the same as `grunt server` but will run a server on the `dist/` folder and rebuild it upon file changes. Reachable at http://0.0.0.0:9002


**Create Distribution Build (in dist/)**
```shell
grunt build
```

### Publishing to gh-pages branch
**Make sure to commit your changes to the current branch before publishing to gh-pages!**
```shell
grunt pubhlish
```

Running this task will create a temporary clone of the current repository, create a `gh-pages` branch if one doesn't already exist, copy over all files from the `dist` directory that match patterns from the`src` configuration, commit all changes, and push to the `origin` remote.

If a `gh-pages` branch already exists, it will be updated with all commits from the remote before adding any commits from the provided `src` files.

**Note** that any files in the `gh-pages` branch that are *not* in the `src` files **will be removed**.