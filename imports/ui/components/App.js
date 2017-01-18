import React from 'react';
import {Link} from "react-router";
import {Container, Menu} from 'semantic-ui-react'

export default class extends React.Component {
  render() {
    return (
      <div>
        <Menu pointing secondary>
          <Link to="/games">{
            ({isActive, location, href, onClick, transition}) =>
              <Menu.Item
                name="games"
                active={isActive}
                onClick={onClick}
              >
                {"Игры"}
              </Menu.Item>
          }</Link>
          <Menu.Menu position='right'>
            <Menu.Item name='logout' onClick={this.logout} />
          </Menu.Menu>
        </Menu>
        <Container fluid>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
