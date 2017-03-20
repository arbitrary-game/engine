import React from 'react';
import {Link} from 'react-router';
import {Button} from 'semantic-ui-react';

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import GamesListJoined from './GamesListJoined';
import GamesListActive from './GamesListActive';

export class GamesListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {limit: 4};
  }

  changeSubscription() {
    console.log(this.state)
    const {limit} = this.state;
    if (limit < 20){
      this.setState({limit: limit+1})
    }
    else {
      this.setState({limit: 4})
    }
  }
  render() {
    return (
      <div className="games-list">
        <GamesListJoined limit={this.state.limit} changeSubscription={this.changeSubscription.bind(this)}/>
        <GamesListActive />
        <div className="fixed-form top-divider">
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
          <Link to="#">{
            ({isActive, location, href, onClick, transition}) =>
              <Button
                as="a"
                href={href}
                onClick={this.changeSubscription.bind(this)}
                icon="plus"
                className="marginal"
                color="violet"
                basic
                fluid
                compact
                content={'Inc limit from parent'}
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
