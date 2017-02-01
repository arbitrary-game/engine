import {Meteor} from "meteor/meteor";
import {createContainer} from "meteor/react-meteor-data";
import Tracker from "tracker-component";
import React from "react";
import {Container} from "semantic-ui-react";
import LoginForm from "./LoginForm";
import TopMenu from "./TopMenu";
import FixedHeader from "./FixedHeader";

export class AppComponent extends Tracker.Component {
  constructor(props) {
    super(props);

    this.autorun(() => {
      this.setState({
        isAuthenticated: !!Meteor.userId()
      });
    });
  }

  render() {
    return (
      <div>
        <TopMenu />
        <Container fluid className="marginal with-top-padding">
          {this.state.isAuthenticated ? this.props.children : <LoginForm />}
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
