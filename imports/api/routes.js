import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter, Match, Link} from 'react-router'

import App from '../ui/containers/App'
import Dashboard from '../ui/containers/Dashboard'

export const renderRoutes = () => (
  <BrowserRouter>
    <App>
      <Match exactly pattern="/" component={Dashboard} />
    </App>
  </BrowserRouter>
);
