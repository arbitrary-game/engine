import React from 'react';
import {Container} from 'semantic-ui-react'

import TopMenu from './TopMenu'

export default class extends React.Component {
  render() {
    return (
      <div>
        <TopMenu />
        <Container fluid>
          {this.props.children}
        </Container>
      </div>
    );
  }
}
