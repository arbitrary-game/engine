import React from 'react';
import { Container } from 'semantic-ui-react'

export default class extends React.Component {
  render() {
    return (
      <Container fluid>
        {this.props.children}
      </Container>
    );
  }
}
