// REACT
import React, { Component, PureComponent } from 'react'
import { array, bool, func, object, oneOfType, string } from 'prop-types'

// REDUX
import { connect } from 'react-redux'
const HASH_ROUTING_SWITCH_ROUTE = 'HASH_ROUTING_SWITCH_ROUTE'
const HASH_ROUTING_SET_NEXT_ROUTE = 'HASH_ROUTING_SET_NEXT_ROUTE'
const HASH_ROUTING_INIT_ROUTING = 'HASH_ROUTING_INIT_ROUTING'
const HASH_ROUTING_UPDATE_ACCESS_TO_ROUTE =
  'HASH_ROUTING_UPDATE_ACCESS_TO_ROUTE'


// LIBS
import immutable from 'immutable'

class HashRouterComponent extends PureComponent {
  static get propTypes () {
    return {
      children: oneOfType([array, object]),
      initRouting: func,
      loaderComponent: object,
      router: object
    }
  }

  componentDidMount () {
    let router = {}
    let routeKey
    router.routes = {}
    router.active = ''
    router.next = ''
    React.Children.map(this.props.children, child => {
      routeKey = child.props.routeKey.toString()
      router.routes[routeKey] = {}
      router.routes[routeKey].accessible = child.props.initAccess
    })
    router = immutable.fromJS(router).merge(this.props.router)
    this.props.initRouting(router)
    this.executeLocation = this.executeLocation.bind(this)
    window.addEventListener('hashchange', this.executeLocation, false)
    this.executeLocation(this.props, router)
  }

  componentWillReceiveProps (props) {
    if (
      !this.props.router ||
      !(
        props.router &&
        this.props.router.get('routes').equals(props.router.get('routes'))
      )
    ) {
      this.executeLocation(props)
    }
  }

  componentWillUnmount () {
    window.removeEventListener('hashchange', this.executeLocation)
  }

  executeLocation (props, router) {
    if (typeof props.router === 'undefined') {
      props = this.props
    }
    if (typeof router === 'undefined') {
      router = props.router
    }
    if (typeof router === 'undefined') {
      return null
    }

    const { switchRoute, setNextRoute, children } = props

    let hash =
      typeof window.location !== 'undefined' ? window.location.hash : '#'

    let hashPath = hash.split('/')
    if (hashPath[0] === '') {
      hashPath[0] = '#'
    }
    let routesPath = []
    let scores = []
    let routes = []
    let params = []
    React.Children.map(children, child => {
      let childArray = child.props['hash'].split('/')
      if (childArray[childArray.length - 1] === '') {
        childArray.pop()
      }
      routesPath.push(childArray)
      scores.push(0)
      routes.push(child)
      params.push({})
    })

    const regexParam = /^{(.*)}$/
    for (let j = 0; j < routesPath.length; j++) {
      for (let i = 0; i < hashPath.length || i < routesPath[j].length; i++) {
        if (hashPath[i] && routesPath[j][i]) {
          if (hashPath[i] === routesPath[j][i]) {
            scores[j] += 100
          } else if (routesPath[j][i].match(regexParam, '$1')) {
            scores[j] += 1
            params[j][routesPath[j][i].match(regexParam, '$1')[1]] = hashPath[i]
          } else {
            scores[j] = 0
            break
          }
        } else if (!hashPath[i] && routesPath[j][i]) {
          if (!routesPath[j][i].match(regexParam, '$1')) {
            scores[j] = 0
            break
          }
        }
      }
    }

    if (routesPath.length > 0) {
      let max = 0
      let maxId = 0
      for (let i = 0; i < scores.length; i++) {
        if (scores[i] > max) {
          max = scores[i]
          maxId = i
        }
      }

      if (routes[maxId].props.routeKey !== router.get('next')) {
        setNextRoute(routes[maxId].props.routeKey, params[maxId])
      }
      if (routes[maxId].props.routeKey !== router.get('active')) {
        if (
          router.getIn(['routes', routes[maxId].props.routeKey, 'accessible'])
        ) {
          switchRoute(routes[maxId].props.routeKey, params[maxId])
        }
      } else {
        if (
          !router.getIn(['routes', routes[maxId].props.routeKey, 'accessible'])
        ) {
          switchRoute('', null)
        } else if (JSON.stringify(params[maxId]) !== JSON.stringify((router && router.toJS().params) || {})) {
          switchRoute(routes[maxId].props.routeKey, params[maxId])
        }
      }
    }
  }

  render () {
    const { loaderComponent, router } = this.props
    let matchElem = null

    React.Children.map(this.props.children, child => {
      if (router && router.get('active') === child.props.routeKey.toString()) {
        matchElem = child
      }
    })

    return matchElem || loaderComponent || <div>no elements matched</div>
  }
}

export class Route extends PureComponent {
  static get propTypes () {
    return {
      children: object,
      hash: string.isRequired,
      initAccess: bool.isRequired,
      routeKey: string.isRequired
    }
  }

  render () {
    return this.props.children
  }
}

class HashRouter extends Component {
  static get propTypes () {
    return {
      children: oneOfType([array, object]),
      loaderComponent: object,
      routerStatePath: string.isRequired
    }
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { routerStatePath, loaderComponent, children } = this.props

    return React.createElement(
      connect(
        state => {
          let router = state.getIn(routerStatePath.split('.'))
          return { loaderComponent, router }
        },
        dispatch => ({
          initRouting: router =>
            dispatch({
              type: HASH_ROUTING_INIT_ROUTING,
              routerStatePath,
              router
            }),
          switchRoute: (routeKey, params) =>
            dispatch({
              type: HASH_ROUTING_SWITCH_ROUTE,
              routerStatePath,
              routeKey,
              params
            }),
          setNextRoute: routeKey =>
            dispatch({
              type: HASH_ROUTING_SET_NEXT_ROUTE,
              routerStatePath,
              routeKey
            })
        })
      )(HashRouterComponent),
      null,
      children
    )
  }
}

export default HashRouter

export {
  HASH_ROUTING_INIT_ROUTING,
  HASH_ROUTING_SET_NEXT_ROUTE,
  HASH_ROUTING_SWITCH_ROUTE,
  HASH_ROUTING_UPDATE_ACCESS_TO_ROUTE
}
