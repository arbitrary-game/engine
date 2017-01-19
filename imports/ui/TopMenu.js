import React from 'react';
import {Link} from "react-router";
import {Menu} from 'semantic-ui-react'

export default class extends React.Component {
  render() {
    return (
      <Menu pointing secondary>
        <Link to="/">{
          ({isActive, location, href, onClick, transition}) =>
            <Menu.Item
              name="home"
              active={isActive}
              onClick={onClick}
            >
              {"The Arbitrary Game"}
            </Menu.Item>
        }</Link>
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
          <Menu.Item name='logout' onClick={this.logout}>
            {"Учетная запись"}
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}
