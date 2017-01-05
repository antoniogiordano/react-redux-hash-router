# react-hash-router
A hash router for React

## Install in your project
npm i react-hash-routing

### Quick start
```jsx
import React from 'react';
import HashRouter from 'react-hash-routing';

export default class Sample extends React.Component {
  ...
  onLocationChanged (childKey, params, cb) {
      switch (childKey) {
        case 'home':
          cb()
          break
        case 'contacts':
          cb()
          break
        case 'customPage':
          cb()
          break
        default:
          cb()
          break
      }
    },
  render() {
    return (
      <HashRouter onLocationChanged={this.onLocationChanged}>
      	<div key='home' data-hash='#/'>Home</div>
      	<div key='contacts' data-hash='#/contacts'>Contacts</div>
      	<YourCustomComponent key='customPage' data-hash='#/custom' />
      </HashRouter>
    )
  }
}
```

### Build sources
npm i

### Develop mode
npm run develop