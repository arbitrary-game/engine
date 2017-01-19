import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter, Match, Redirect} from 'react-router'

import AppContainer from './AppContainer'
import GamesListContainer from './Games/GamesListContainer'
import GamesCreateContainer from './Games/GamesCreateContainer'

export const renderRoutes = () => (
  <BrowserRouter>
    <AppContainer>
      <Match exactly pattern="/" render={routerProps => <Redirect to="/games"/>} />
      <Match exactly pattern="/games" component={GamesListContainer} />
      <Match exactly pattern="/games/create" component={GamesCreateContainer} />
    </AppContainer>
  </BrowserRouter>
);
