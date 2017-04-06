import React from 'react';
import {Link} from 'react-router';
import {Segment, Feed, Icon, Header, Divider, Card} from 'semantic-ui-react'

import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import {every} from "lodash";
import moment from "moment";
import Games from "/imports/api/Games/GamesCollection";
import Transactions from "/imports/api/Transactions/TransactionsCollection"


export class TransactionsListComponent extends React.Component {
  render() {
    const {myTransactions, isLoading} = this.props;
    return (
      <Segment vertical>
        <Header as="h2" style={{color: '#767676'}}>Транзакции</Header>
        <Segment vertical loading={isLoading}>
          <Card.Group itemsPerRow={1}>
                  {myTransactions.map((transaction, index) => {
                    let gameName
                    if (transaction.gameId) {
                      const game = Games.findOne(transaction.gameId)
                      if (game){
                        gameName = game.name
                      }
                    }

                return <Card key={index}>
                  <Card.Content>
                   <Card.Header>{transaction.type == 'in' ? <span className="win-color">+{transaction.amount}</span> : <span className="lose-color">-{transaction.amount}</span>}</Card.Header>
                   <Card.Description>
                     {transaction.gameId &&
                       <Link
                         to={`/games/show/${transaction.gameId}`}
                       >Игра: {gameName} </Link>
                     }
                    </Card.Description>
                    <Card.Meta>{moment(transaction.createdAt).fromNow()}</Card.Meta>
                  </Card.Content>
                </Card>
            })}
          </Card.Group>
    </Segment>
    </Segment>
    );
  }
}

export const TransactionsListContainer = createContainer(({params}) => {
  let subscriptions = [];
  subscriptions.push(Meteor.subscribe('Transactions.mine'));
  subscriptions.push(Meteor.subscribe('Games.mine'));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  const myTransactions = Transactions.find({}, {sort: {createdAt: -1}}).fetch();
  return {
    isLoading,
    myTransactions,
  };
}, TransactionsListComponent);

export default TransactionsListContainer;