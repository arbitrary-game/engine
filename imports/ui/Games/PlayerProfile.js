import React from 'react';
import {Button, Card, Image} from "semantic-ui-react";

import { createContainer } from 'meteor/react-meteor-data';

export class PlayerProfile extends React.Component {
  render() {
    const {isActive, player, avatarUrl, onClose, onKick} = this.props;

    const label = Meteor.userId() == player.user()._id ? "Leave" : "Kick";

    return <Card fluid className="player-profile">
        <Card.Content>
          <Image floated='right' size='mini' src={avatarUrl} />
          <Card.Header>
            {player.user().profile.name}
          </Card.Header>
          <Card.Meta>
            {i18n.__("Games.Profile.Balance", {amount: player.stash})}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <div className="full-width">
            {isActive && <Button basic fluid color='red' icon="user x" content={i18n.__(`Games.Profile.${label}`)} onClick={onKick} />}
            <Button basic fluid color='grey' content={i18n.__("Games.Profile.Close")} onClick={onClose} />
          </div>
        </Card.Content>
      </Card>
  }
}

export default PlayerProfile;
