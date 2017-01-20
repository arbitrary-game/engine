import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter, Match, Redirect} from 'react-router'
import {Container} from 'semantic-ui-react'

import App from './App'
import GamesListContainer from './Games/GamesList'
import GamesCreateContainer from './Games/GamesCreate'

import { Accounts, STATES } from 'meteor/std:accounts-ui'

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_EMAIL_NO_PASSWORD',
  profilePath: "/"
});

export const renderRoutes = () => (
  <BrowserRouter>
    <Container>
      <Match exactly pattern="/signin" component={() => <Accounts.ui.LoginForm />} />
      <Match exactly pattern="/signup" component={() => <Accounts.ui.LoginForm formState={STATES.SIGN_UP} />} />
      <App>
        <Match exactly pattern="/" render={routerProps => <Redirect to="/games"/>} />
        <Match exactly pattern="/games" component={GamesListContainer} />
        <Match exactly pattern="/games/create" component={GamesCreateContainer} />
      </App>
    </Container>
  </BrowserRouter>
);
