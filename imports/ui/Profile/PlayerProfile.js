import {every} from "lodash";
import React from 'react';
import {Button, Card, Image} from "semantic-ui-react";
import ShowAvatar from '/imports/common/ShowAvatar';
import { createContainer } from 'meteor/react-meteor-data';
import TransactionsListContainer from './TransactionsList'
import {TransactionsAddTmp} from "/imports/api/Transactions/TransactionsMethods";

export class PlayerProfileComponent extends React.Component {
  addMoneyTmp() {
    const {userId} = this.props;
    TransactionsAddTmp.call({type: 'in', amount: 500, userId: userId});
  }
  renderHeader(className) {
    const {user} = this.props;
    return (
      <div className={className}>
        <Card fluid>
          <Card.Content>
            <Image floated='right' size='mini' src={ShowAvatar(user)} />
            <Card.Header>
              {user.profile.name}
            </Card.Header>
            <Card.Meta className="black-color">
              {i18n.__("Games.Profile.Balance", {amount: user.amount})}
            </Card.Meta>
            <Button color="violet" onClick={this.addMoneyTmp.bind(this)}>Добавить монет</Button>
          </Card.Content>
        </Card>
      </div>
    )
  }
  render() {
    const {isLoading} = this.props;

    if (isLoading) {
      return (
        <div className="games-show">
          <div className="loading">{'Загрузка...'}</div>
        </div>
      );
    }

    return <div className="games-show">
      {this.renderHeader("games-header fixed bottom-divider")}
      {this.renderHeader("games-header fixed-doubler bottom-divider no-visibility") /* Rendering header twice to push the content down: http://stackoverflow.com/a/6414716/303694 */}
      <TransactionsListContainer />
    </div>
  }
}

export const PlayerProfileContainer = createContainer(({params}) => {
  const subscriptions = [];
  subscriptions.push(Meteor.subscribe('Users.current'));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  const userId = Meteor.userId();
  const user = Meteor.user();

  return {
    isLoading,
    userId,
    user
  };

}, PlayerProfileComponent);

export default PlayerProfileContainer;
