import React from 'react';
import {Link} from 'react-router';
import {Menu, Dropdown, Icon} from 'semantic-ui-react'

export default class extends React.Component {
  render() {
    return (
      <Menu className="top-menu" secondary>
        <Link to='/'>{
          ({isActive, location, href, onClick, transition}) =>
            <Menu.Item
              name='home'
              active={false}
              onClick={onClick}
            >
              <strong>
                {'The Arbitrary Game'}
              </strong>
            </Menu.Item>
        }</Link>
        {/*<Link to='/games'>{*/}
        {/*({isActive, location, href, onClick, transition}) =>*/}
        {/*<Menu.Item*/}
        {/*name='games'*/}
        {/*active={isActive}*/}
        {/*onClick={onClick}*/}
        {/*>*/}
        {/*{'Игры'}*/}
        {/*</Menu.Item>*/}
        {/*}</Link>*/}
        <Menu.Menu position='right'>
          <Dropdown className='item' icon='ellipsis vertical'>
            <Dropdown.Menu>
              <Dropdown.Item>
                <Icon name='trophy' />
                <span className="text">{'Рейтинг'}</span>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item>
                <Icon name='user' />
                <span className="text">{'Профиль'}</span>
              </Dropdown.Item>
              <Dropdown.Item>
                <Icon name='sign out' />
                <span className="text">{'Выход'}</span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    )
  }
}