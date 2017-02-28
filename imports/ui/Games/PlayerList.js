import React from 'react';
import {List, Button, Card, Image} from "semantic-ui-react";
import {map} from "lodash";
import i18n from 'meteor/universe:i18n';

import {createContainer} from 'meteor/react-meteor-data';

export class PlayerList extends React.Component {
  render() {
    const {rows} = this.props;
    const showProfileLabel = i18n.__("Games.PlayerList.ShowProfileLabel");

    return <Card fluid className="top-bar">
      <Card.Content>
        <List divided relaxed='very' verticalAlign='middle'>
          {map(rows, row => {
            const balanceText = i18n.__("Games.PlayerList.Balance", {amount: row.stash});

            return <List.Item key={row.playerId}>
              <List.Content floated='right'>
                <Button color="violet" onClick={row.showProfile}>{showProfileLabel}</Button>
              </List.Content>
              <Image avatar src={row.avatarUrl}/>
              <List.Content>
                <List.Header as='strong'>{row.name}</List.Header>
                <List.Description>{balanceText}</List.Description>
              </List.Content>
            </List.Item>
          })}
        </List>
      </Card.Content>
    </Card>
  }
}

export default PlayerList;
