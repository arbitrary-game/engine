import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import React from "react";
import {Link} from "react-router";
import {Menu, Dropdown, Icon} from "semantic-ui-react";
import {every} from "lodash";
import errback from "/imports/common/errback";
import {UsersPushLoginToken} from "/imports/api/Users/UsersMethods";

export class TopMenuComponent extends React.Component {
  render() {
    const {userId, user, isLoading} = this.props;
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
              <Dropdown.Item as='a' href="https://medium.com/@dengorbachev/the-arbitrary-game-russian-translation-32153eb29cf7#.4bcepoa4y" target="_blank">
                <Icon name='book' />
                <span className="text">{'Правила'}</span>
              </Dropdown.Item>
              <Dropdown.Item as='a' href="mailto:denis.d.gorbachev@gmail.com" target="_blank">
                <Icon name='question' />
                <span className="text">{'Помощь'}</span>
              </Dropdown.Item>
              {
                Meteor.settings.public.isDebug &&
                <Dropdown.Divider />
              }
              {
                Meteor.settings.public.isDebug &&
                <Dropdown.Item onClick={this.login.bind(this, "AliceRipleyUser")}>
                  <Icon name={userId === "AliceRipleyUser" ? "checkmark" : "exchange"} />
                  <span className="text">{'Alice Ripley'}</span>
                </Dropdown.Item>
              }
              {
                Meteor.settings.public.isDebug &&
                <Dropdown.Item onClick={this.login.bind(this, "BobDylanUser")}>
                  <Icon name={userId === "BobDylanUser" ? "checkmark" : "exchange"} />
                  <span className="text">{'Bob Dylan'}</span>
                </Dropdown.Item>
              }
              {
                Meteor.settings.public.isDebug &&
                <Dropdown.Item onClick={this.login.bind(this, "WinstonChirchillUser")}>
                  <Icon name='key' />
                  <span className="text">{'Winston Chirchill'}</span>
                </Dropdown.Item>
              }
              <Dropdown.Divider />
              {
                userId &&
                <Dropdown.Item>
                  <Icon name='user' />
                  <span className="text">{'Ваш профиль'}</span>
                </Dropdown.Item>
              }
              {
                userId &&
                <Dropdown.Item onClick={() => Meteor.logout()}>
                  <Icon name='sign out' />
                  <span className="text">{'Выход'}</span>
                </Dropdown.Item>
              }
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    )
  }

  login(token) {
    UsersPushLoginToken.call(token, errback(() => Meteor.loginWithToken(token)));
  }
}

export const TopMenuContainer = createContainer(({params}) => {
  let subscriptions = [];
  subscriptions.push(Meteor.subscribe('Users.current'));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  const userId = Meteor.userId();
  const user = Meteor.user();
  return {
    isLoading,
    userId,
    user
  };
}, TopMenuComponent);

export default TopMenuContainer;
