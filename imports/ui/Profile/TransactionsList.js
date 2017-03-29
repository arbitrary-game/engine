import React from 'react';
import {Link} from 'react-router';
import {Segment, Feed, Icon, Header, Divider} from 'semantic-ui-react'

import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import {every} from "lodash";
import moment from "moment";

import Transactions from "/imports/api/Transactions/TransactionsCollection"


export class TransactionsListComponent extends React.Component {
  render() {
    const {myTransactions, isLoading} = this.props;
    return (
      <Segment vertical loading={isLoading}>
        <Feed className="games-feed">
          <Header as="h2" style={{color: '#767676'}}>Транзакции</Header>
          {myTransactions.map((transaction, index) => (
            <Link
              to={`/games/show/${transaction._id}`}
              key={transaction._id}
              title={transaction._id}
            >{
              ({isActive, location, href, onClick, transition}) =>
                <Feed.Event onClick={onClick}>
                  {/*<Feed.Label>*/}
                    {/*1*/}
                  {/*</Feed.Label>*/}
                  <Feed.Content>
                    <Feed.Summary>
                      {transaction.amount}
                      {moment(transaction.createdAt).fromNow()}
                      {/*<Feed.Date>сегодня в 18:45</Feed.Date>*/}
                    </Feed.Summary>
                    <Feed.Meta>
                      <Feed.Like>
                        <Icon name='user' />
                        &nbsp;
                        {transaction.type}
                      </Feed.Like>
                    </Feed.Meta>
                  </Feed.Content>
                </Feed.Event>
            }
            </Link>
          ))}
          {!myTransactions.length && <i>Нет транзакций</i>}
        </Feed>
      </Segment>
    );
  }
}

export const TransactionsListContainer = createContainer(({params}) => {
  let subscriptions = [];
  subscriptions.push(Meteor.subscribe('Transactions.mine'));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  const myTransactions = Transactions.find({}, {sort: {createdAt: -1}}).fetch();
  return {
    isLoading,
    myTransactions,
  };
}, TransactionsListComponent);

export default TransactionsListContainer;