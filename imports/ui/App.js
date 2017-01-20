import React from 'react';
import {Container, Divider} from 'semantic-ui-react'

import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import TopMenu from './TopMenu'

export class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <TopMenu />
        <Divider fitted className="marginal" />
        <Container fluid className="marginal">
          {this.props.children}
        </Container>
        {/*<Container fluid className="marginal" textAlign="center">*/}
          {/*<a href="mailto:denis.d.gorbachev@gmail.com">{'Нужна помощь?'}</a>*/}
        {/*</Container>*/}
      </div>
    );
  }
}

export const AppContainer = createContainer(({params}) => {
  return {};
}, AppComponent);

export default AppContainer;
