# react-redux-hash-router
A hash router for React and Redux

## Install in your project
npm i react-redux-hash-router

### Quick start
```js
import React, { Component } from 'react';
import HashRouter, {Route} from 'react-redux-hash-router';

export default class Sample extends Component {
  render() {
    return (
      <HashRouter
          routerStatePath='routing.mainRouter'
          loaderComponent={<LoadingPage />}
      >
        <Route hash='#/sign' initAccess={true} routeKey='sign'>
          <Sign />
        </Route>
        <Route hash='#' initAccess={false} routeKey='dashboard'>
          <Dashboard />
        </Route>
      </HashRouter>
    )
  }
}
```

### Build sources
npm i

### Develop mode
npm run develop
