import React from "react";
import {Header} from "semantic-ui-react";
import AutoForm from "uniforms-semantic/AutoForm";
import SubmitField from "uniforms-semantic/SubmitField";
import GamesSchema from "/imports/api/Games/GamesSchema";
import {GamesInsert} from "/imports/api/Games/GamesMethods";

export default class GamesCreateComponent extends React.Component {
  render() {
    return (
      <div>
        <Header as="h1">{'Новая игра'}</Header>
        <AutoForm
          schema={GamesSchema}
          submitField={() => <SubmitField className="primary" />}
          onSubmit={game => GamesInsert.run(game)}
        />
      </div>
    );
  }
}
