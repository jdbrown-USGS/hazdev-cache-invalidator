'use strict';


var View = require('mvc/View'),

    CacheInvalidator = require('./CacheInvalidator');


/**
 * Cache invalidator view.
 *
 * @param options {Object}
 *        all options are passed to View.
 * @param options.invalidator {CacheInvalidator}
 *        default CacheInvalidator().
 *        invalidator to use for invalidation.
 * @param options.paths {Array}
 *        array of paths to show in view.
 */
var InvalidatorView = function (options) {
  var _this,
      _initialize,
      // variables
      _button,
      _invalidator,
      _paths,
      _results,
      // methods
      _invalidatePath,
      _onClick,
      _showResult;

  _this = View(options);

  _initialize = function (options) {
    var el;

    options = options || {};
    _invalidator = options.invalidator || CacheInvalidator();

    el = _this.el;
    el.classList.add('invalidator-view');
    el.innerHTML =
        '<div class="vertical">' +
          '<label for="paths">Site-relative path</label>' +
          '<textarea id="paths" class="paths"></textarea>' +
          '<button>Invalidate</button>' +
        '</div>' +
        '<div class="results"></div>';
    _paths = el.querySelector('.paths');
    _button = el.querySelector('button');
    _results = el.querySelector('.results');

    if (options.paths) {
      _paths.value = options.paths.join('\n');
    }

    _button.addEventListener('click', _onClick);
  };

  /**
   * Invalidate one path and show the results.
   *
   * @param path {String}
   *        path to invalidate.
   */
  _invalidatePath = function (path) {
    var el;
    path = path.trim();
    if (path === '') {
      return;
    }

    el = _results.appendChild(document.createElement('div'));
    el.classList.add('alert');
    el.innerHTML = '<h2>' + path + '</h2>' +
          '<div class="status">Pending</div>';
    _invalidator.invalidate(path, function (status, xhr, response) {
      _showResult(el, response, xhr);
    });
  };

  /**
   * Click handler for invalidate button.
   */
  _onClick = function (e) {
    var paths;

    e.preventDefault();

    _results.innerHTML = '';
    paths = _paths.value;
    paths = paths.split(/[\r\n]+/);
    paths.forEach(_invalidatePath);
  };

  /**
   * Format the results of an invalidation request.
   *
   * @param el {DOMElement}
   * @param response {Object<servername => Object<hostname => status>>}
   *        null if request failed.
   * @param xhr {XMLHttpRequest}
   */
  _showResult = function (el, response, xhr) {
    var host,
        hostnames,
        server,
        success,
        status,
        statusEl;

    statusEl = el.querySelector('.status');

    if (response === null) {
      el.classList.add('error');
      statusEl.innerHTML = 'Error: ' + xhr.status + ' ' + xhr.statusText +
          '<pre>' + xhr.responseText + '</pre>';
      return;
    }

    success = false;
    for (server in response) {
      hostnames = response[server];
      for (host in hostnames) {
        status = hostnames[host];
        if (status === 200) {
          success = true;
          break;
        }
      }
      if (success) {
        break;
      }
    }

    if (success) {
      el.classList.add('success');
      statusEl.innerHTML = 'Caches cleared';
    } else {
      el.classList.add('info');
      statusEl.innerHTML = 'Page was not cached';
    }
  };

  _initialize(options);
  options = null;
  return _this;
};


module.exports = InvalidatorView;
