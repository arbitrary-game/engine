import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter, Match, Redirect} from 'react-router'

import App from './App'
import GamesListContainer from './Games/GamesList'
import GamesCreateContainer from './Games/GamesCreate'

export const renderRoutes = () => (
  <BrowserRouter>
    <App>
      <Match exactly pattern="/" render={routerProps => <Redirect to="/games"/>} />
      <Match exactly pattern="/games" component={GamesListContainer} />
      <Match exactly pattern="/games/create" component={GamesCreateContainer} />
    </App>
  </BrowserRouter>
);
