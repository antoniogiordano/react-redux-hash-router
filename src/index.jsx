/**
 * Created by AntonioGiordano on 06/07/16.
 */

import React from 'react'
import $ from 'jquery'

const ReactHashRouter = React.createClass({
  _childKey: null,
  _params: [],
  propTypes: {
    onLocationChanged: React.PropTypes.func,
    className: React.PropTypes.any
  },
  getDefaultProps () {
    return {
      onLocationChanged: (childKey, params, cb) => cb(),
      className: ''
    }
  },
  getInitialState () {
    return {
      style: {
        opacity: 0
      }
    }
  },
  componentDidMount () {
    $(window).on('hashchange', this._onHashChange)
    this._onHashChange()
  },
  _onHashChange () {
    var comp = this
    this.setState({
      style: {
        opacity: 0
      }
    })
    var ret = this._matchedPage()
    if (ret !== null) {
      this.props.onLocationChanged(this._childKey, this._params, () => {
        setTimeout(() => {
          this.setState({
            style: {
              transition: 'opacity 500ms',
              opacity: 1
            }
          })
        }, 100)
        comp.forceUpdate()
      })
    }
  },
  componentWillUpdate () {
    return false
  },
  _matchedPage () {
    var hash = (typeof window.location !== 'undefined') ? window.location.hash : '#/'
    var locArray = hash.split('/')
    if (locArray.length > 0) {
      if (locArray[0] === '#') {
        locArray.shift()
      }
    }
    var locations = []
    var scores = []
    var childes = []
    var params = []
    React.Children.map(this.props.children, (child) => {
      var childArray = child.props.dataHash.split('/')
      if (childArray.length > 0) {
        childArray.shift()
      }
      locations.push(childArray)
      scores.push(0)
      childes.push(child)
      params.push({})
    })

    var i
    for (i = 0; i < locations.length; i++) {
      if (locations[i].length !== locArray.length) {
        locations.splice(i, 1)
        scores.splice(i, 1)
        childes.splice(i, 1)
        params.splice(i, 1)
        i--
      }
    }
    var regexParam = /^{(.*)}$/
    for (i = 0; i < locArray.length; i++) {
      for (var j = 0; j < locations.length; j++) {
        if (locArray[i] === locations[j][i]) {
          scores[j] += 100
        } else if (locations[j][i].match(regexParam, '$1') !== null) {
          scores[j] += 1
          params[j][locations[j][i].match(regexParam, '$1')[1]] = locArray[i]
        } else {
          locations.splice(j, 1)
          scores.splice(j, 1)
          childes.splice(j, 1)
          params.splice(j, 1)
          j--
        }
      }
    }

    if (locations.length > 0) {
      var max = 0
      var maxId = 0
      for (i = 0; i < scores.length; i++) {
        if (scores[i] > max) {
          max = scores[i]
          maxId = i
        }
      }

      this._childKey = childes[maxId].key
      this._params = params[maxId]

      return childes[maxId]
    } else {
      return null
    }
  },
  render () {
    return (
      <div className={this.props.className} style={this.state.style}>
        {this._matchedPage()}
      </div>
    )
  }
})

module.exports = ReactHashRouter
