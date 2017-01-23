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
    const {user, isLoading} = this.props;
    console.log(isLoading);
    if (!isLoading) {
      debugger;
    }
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
                  <Icon name='key' />
                  <span className="text">{'Alice Ripley'}</span>
                </Dropdown.Item>
              }
              <Dropdown.Divider />
              {
                Meteor.userId() &&
                !isLoading &&
                <Dropdown.Item>
                  <Icon name='user' />
                  <span className="text">{Meteor.user().profile.name}</span>
                </Dropdown.Item>
              }
              {
                Meteor.userId() &&
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
  console.log("createContainer");
  let subscriptions = [];
  subscriptions.push(Meteor.subscribe('Users.current', function() {
    console.log("onReady");
  }));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  const user = Meteor.user();
  return {
    isLoading,
    user
  };
}, TopMenuComponent);

export default TopMenuContainer;
