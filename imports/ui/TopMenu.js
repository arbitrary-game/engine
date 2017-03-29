import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import React from "react";
import {Link} from "react-router";
import {Popup, Menu, Dropdown, Icon} from "semantic-ui-react";
import {every} from "lodash";
import i18n from 'meteor/universe:i18n';
import moment from "moment";

import errback from "../common/errback";
import {UsersPushLoginToken} from "../api/Users/UsersMethods";

export class TopMenuComponent extends React.Component {
  render() {
    const {userId, user, isLoading, status} = this.props;

    const waiting = status.status !== 'connected';
    let retryIn;
    if (waiting) {
      if (status.retryTime) {
        retryIn = Math.ceil(Math.abs(moment().diff(new Date(status.retryTime))) / 1000);
      } else {
        retryIn = 1;
      }
      setTimeout(() => { this.forceUpdate(); }, 1000);
    }

    return (
      <Menu className="top-menu bottom-divider" secondary fixed="top">
        <Link to="/">{
          ({isActive, location, href, onClick, transition}) =>
            <Menu.Item
              name="home"
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
        <Menu.Menu position="right">
          {waiting && <Menu.Item className="waitingForConnection">
            <Popup
              trigger={<Icon name="lightning" />}
              content={<span>{i18n.__('Generic.ConnectionIssue', {amount: retryIn})} ({<a href="#" onClick={this.reconnect}>{i18n.__('Generic.ConnectionRetry')}</a>})</span>}
              basic
            />
          </Menu.Item>}
          <Dropdown className="item" icon="ellipsis vertical">
            <Dropdown.Menu>
              {/*<Dropdown.Item>*/}
              {/*<Icon name='trophy' />*/}
              {/*<span className="text">{'Рейтинг'}</span>*/}
              {/*</Dropdown.Item>*/}
              <Dropdown.Item as="a" href="https://medium.com/@dengorbachev/the-arbitrary-game-russian-translation-32153eb29cf7#.4bcepoa4y" target="_blank">
                <Icon name="book" />
                <span className="text">{'Правила'}</span>
              </Dropdown.Item>
              <Dropdown.Item as="a" href="mailto:denis.d.gorbachev@gmail.com" target="_blank">
                <Icon name="question" />
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
                <Dropdown.Item onClick={this.login.bind(this, "WinstonChurchillUser")}>
                  <Icon name={userId === "WinstonChurchillUser" ? "checkmark" : "exchange"} />
                  <span className="text">{'Winston Churchill'}</span>
                </Dropdown.Item>
              }
              <Dropdown.Divider />
              {
              userId &&
                <Link to="/profile">{
                  ({isActive, location, href, onClick, transition}) =>
                    <Dropdown.Item  as="a" onClick={onClick}>
                      <Icon name='user' />
                      <span className="text">{'Ваш профиль'}</span>
                    </Dropdown.Item>
                }</Link>
              }
              {
                userId &&
                <Dropdown.Item onClick={() => Meteor.logout()}>
                  <Icon name="sign out" />
                  <span className="text">{'Выход'}</span>
                </Dropdown.Item>
              }
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
    );
  }

  reconnect() {
    Meteor.reconnect();
  }

  login(token) {
    UsersPushLoginToken.call(token, errback(() => Meteor.loginWithToken(token)));
  }
}

export const TopMenuContainer = createContainer(({params}) => {
  const subscriptions = [];
  subscriptions.push(Meteor.subscribe('Users.current'));
  const isLoading = !every(subscriptions, subscription => subscription.ready());
  const userId = Meteor.userId();
  const user = Meteor.user();
  const status = Meteor.connection.status();
  return {
    isLoading,
    userId,
    user,
    status,
  };
}, TopMenuComponent);

export default TopMenuContainer;
