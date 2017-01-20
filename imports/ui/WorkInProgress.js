import React from "react";
import {Link} from "react-router";
import {Message} from "semantic-ui-react";

export class WorkInProgressComponent extends React.Component {
  render() {
    const {games} = this.props;
    return (
      <div>
        <Message>
          <Message.Header>{'5 минут, Турецкий'}</Message.Header>
          <p>{'Экран в разработке'}</p>
        </Message>
        <Link to="/games">{'← Назад'}</Link>
      </div>
    );
  }
}

export default WorkInProgressComponent;
