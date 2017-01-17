import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'

import AppContainer from '../ui/containers/AppContainer'
import Dashboard from '../ui/containers/DashboardContainer'

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <IndexRoute component={Dashboard}/>
    </Route>
  </Router>
);
