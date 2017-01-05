'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by AntonioGiordano on 06/07/16.
 */

var ReactHashRouter = _react2.default.createClass({
  _childKey: null,
  _params: [],
  propTypes: {
    onLocationChanged: _react2.default.PropTypes.func,
    className: _react2.default.PropTypes.any
  },
  getDefaultProps: function getDefaultProps() {
    return {
      onLocationChanged: function onLocationChanged(childKey, params, cb) {
        return cb();
      },
      className: ''
    };
  },
  getInitialState: function getInitialState() {
    return {
      style: {
        opacity: 0
      }
    };
  },
  componentDidMount: function componentDidMount() {
    (0, _jquery2.default)(window).on('hashchange', this._onHashChange);
    this._onHashChange();
  },
  _onHashChange: function _onHashChange() {
    var _this = this;

    var comp = this;
    this.setState({
      style: {
        opacity: 0
      }
    });
    var ret = this._matchedPage();
    if (ret !== null) {
      this.props.onLocationChanged(this._childKey, this._params, function () {
        setTimeout(function () {
          _this.setState({
            style: {
              transition: 'opacity 500ms',
              opacity: 1
            }
          });
        }, 100);
        comp.forceUpdate();
      });
    }
  },
  componentWillUpdate: function componentWillUpdate() {
    return false;
  },
  _matchedPage: function _matchedPage() {
    var hash = typeof window.location !== 'undefined' ? window.location.hash : '#/';
    var locArray = hash.split('/');
    if (locArray.length > 0) {
      if (locArray[0] === '#') {
        locArray.shift();
      }
    }
    var locations = [];
    var scores = [];
    var childes = [];
    var params = [];
    _react2.default.Children.map(this.props.children, function (child) {
      var childArray = child.props.dataHash.split('/');
      if (childArray.length > 0) {
        childArray.shift();
      }
      locations.push(childArray);
      scores.push(0);
      childes.push(child);
      params.push({});
    });

    var i;
    for (i = 0; i < locations.length; i++) {
      if (locations[i].length !== locArray.length) {
        locations.splice(i, 1);
        scores.splice(i, 1);
        childes.splice(i, 1);
        params.splice(i, 1);
        i--;
      }
    }
    var regexParam = /^{(.*)}$/;
    for (i = 0; i < locArray.length; i++) {
      for (var j = 0; j < locations.length; j++) {
        if (locArray[i] === locations[j][i]) {
          scores[j] += 100;
        } else if (locations[j][i].match(regexParam, '$1') !== null) {
          scores[j] += 1;
          params[j][locations[j][i].match(regexParam, '$1')[1]] = locArray[i];
        } else {
          locations.splice(j, 1);
          scores.splice(j, 1);
          childes.splice(j, 1);
          params.splice(j, 1);
          j--;
        }
      }
    }

    if (locations.length > 0) {
      var max = 0;
      var maxId = 0;
      for (i = 0; i < scores.length; i++) {
        if (scores[i] > max) {
          max = scores[i];
          maxId = i;
        }
      }

      this._childKey = childes[maxId].key;
      this._params = params[maxId];

      return childes[maxId];
    } else {
      return null;
    }
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: this.props.className, style: this.state.style },
      this._matchedPage()
    );
  }
});

module.exports = ReactHashRouter;