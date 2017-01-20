import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter, Match, Redirect} from 'react-router'
import {Container} from 'semantic-ui-react'

import App from './App'
import WorkInProgress from './WorkInProgress'
import GamesList from './Games/GamesList'
import GamesCreate from './Games/GamesCreate'
import GamesShow from './Games/GamesShow'

import { Accounts, STATES } from 'meteor/std:accounts-ui'

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL_NO_PASSWORD',
  profilePath: "/"
});

export const renderRoutes = () => (
  <BrowserRouter>
    <App>
      <Match exactly pattern="/" render={routerProps => <Redirect to="/games"/>} />
      <Match exactly pattern="/games" component={GamesList} />
      <Match exactly pattern="/games/create" component={GamesCreate} />
      <Match exactly pattern="/games/show/:_id" component={WorkInProgress} />
    </App>
  </BrowserRouter>
);
