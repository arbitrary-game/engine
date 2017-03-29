import {every} from "lodash";
import React from 'react';
import {Button, Card, Image} from "semantic-ui-react";
import ShowAvatar from '/imports/common/ShowAvatar';
import { createContainer } from 'meteor/react-meteor-data';
import TransactionsListContainer from './TransactionsList'

export class PlayerProfileComponent extends React.Component {
  render() {
    const {isLoading, user} = this.props;

    if (isLoading) {
      return (
        <div className="games-show">
          <div className="loading">{'Загрузка...'}</div>
        </div>
      );
    }

    return <div>

      <Card fluid className="top-bar">
        <Card.Content>
          <Image floated='right' size='mini' src={ShowAvatar(user)} />
          <Card.Header>
            {user.profile.name}
          </Card.Header>
          <Card.Meta>
            {i18n.__("Games.Profile.Balance", {amount: user.amount})}
          </Card.Meta>
        </Card.Content>
      </Card>
      <TransactionsListContainer />
    </div>
  }
}

export const PlayerProfileContainer = createContainer(({params}) => {
  const subscriptions = [];
  // subscriptions.push(Meteor.subscribe('Actions.game', 'FinishedGame'));
  subscriptions.push(Meteor.subscribe('Users.current'));
  // subscriptions.push(Meteor.subscribe('Transactions.mine'));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  console.log('subscriptions', subscriptions[0].ready())
  console.log('isLoading', isLoading)
  const userId = Meteor.userId();
  const user = Meteor.user();

  return {
    isLoading,
    userId,
    user
  };

}, PlayerProfileComponent);

export default PlayerProfileContainer;
