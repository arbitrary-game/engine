import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter, Match, Redirect} from 'react-router'

import App from '../ui/containers/App'
import Games from '../ui/containers/Games'

export const renderRoutes = () => (
  <BrowserRouter>
    <App>
      <Match exactly pattern="/" render={routerProps => <Redirect to="/games"/>} />
      <Match exactly pattern="/games" component={Games} />
    </App>
  </BrowserRouter>
);
