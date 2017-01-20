import React from 'react';
import {Link} from 'react-router';
import {Button} from 'semantic-ui-react';

import GamesListActiveContainer from './GamesListActiveContainer';

export default class extends React.Component {
  render() {
    return (
      <div>
        <div className="marginal">
          <Link to="/games/create">{
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
        <GamesListActiveContainer />
      </div>
    );
  }
}
