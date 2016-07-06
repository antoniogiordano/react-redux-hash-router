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
  render() {
    return (
      <HashRouter>
      	<div key='home' hash='#/'>Home</div>
      	<div key='contacts' hash='#/contacts'>Contacts</div>
      	<YourCustomComponent key='customPage' hash='#/custom' />
      </HashRouter>
    )
  }
}
```

### Build sources
npm i