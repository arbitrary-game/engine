import React from 'react';
import {Container, Divider} from 'semantic-ui-react'

import TopMenu from './TopMenu'

export default class extends React.Component {
  render() {
    return (
      <div>
        <TopMenu />
        <Container fluid>
          {this.props.children}
        </Container>
        <Divider />
        <Container className="marginal" textAlign="center" fluid>
          <a href="mailto:denis.d.gorbachev@gmail.com">{'Нужна помощь?'}</a>
        </Container>
      </div>
    );
  }
}
