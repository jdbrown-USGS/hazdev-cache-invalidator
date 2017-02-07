'use strict';

var config = require('./config');

var watch = {
  resources: {
    files: [
      config.src + '/**/*',
      '!' + config.src + '/**/*.scss',
      '!' + config.src + '/**/*.js'
    ],
    tasks: [
      'copy:dev'
    ]
  },

  postcss: {
    files: [
      config.src + '/htdocs/**/*.scss'
    ],
    tasks: [
      'postcss:build'
    ]
  },

  test: {
    files: [
      config.test + '/**/*'
    ],
    tasks: [
      'eslint:tests',
      'browserify:test',
      'browserify:bundle',
      'copy:test'
    ]
  },

  scripts: {
    files: [
      config.src + '/htdocs/**/*.js'
    ],
    tasks: [
      'eslint:scripts',
      'browserify:index',
      'browserify:bundle'
    ]
  },

  gruntfile: {
    files: [
      'Gruntfile.js',
      'gruntconfig/**/*.js'
    ],
    tasks: [
      'eslint:gruntfile'
    ]
  },

  livereload: {
    options: {
      livereload: config.liveReloadPort
    },
    files: [
      config.build + '/' + config.src + '/htdocs/**/*'
    ]
  }
};

module.exports = watch;
