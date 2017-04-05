import React from 'react';
import {Link} from 'react-router';
import {Button} from 'semantic-ui-react';

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import GamesListJoined from './GamesListJoined';
import GamesListActive from './GamesListActive';

export class GamesListComponent extends React.Component {
  render() {
    return (
      <div className="games-list">
        <GamesListJoined />
        <GamesListActive />
        <div className="fixed-form top-divider">
          <Link to="/games/create">
            {
            ({isActive, location, href, onClick, transition}) =>
              <Button
                as="a"
                href={href}
                onClick={onClick}
                icon="plus"
                className="marginal"
                color="violet"
                basic
                fluid
                compact
                content={'Создать игру'}
              />
          }</Link>
        </div>
      </div>
    );
  }
}

export const GamesListContainer = createContainer(({ params }) => {
  return {};
}, GamesListComponent);

export default GamesListContainer;
