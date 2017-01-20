import React from 'react'
import {Container} from 'semantic-ui-react'

import TopMenu from './TopMenu'

import Tracker from 'tracker-component'
import Redirect from 'react-router/Redirect'

export default class extends Tracker.Component {
  constructor(props) {
    super(props);

    this.autorun(() => {
      this.setState({
        isAuthenticated: Meteor.user()
      });
    });
  }

  render() {
    if ( ! this.state.isAuthenticated) return <Redirect to="signin"/>;

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
