import React from 'react';
import {Link} from 'react-router';
import {Header} from 'semantic-ui-react';
import AutoForm from 'uniforms-semantic/AutoForm';
import GamesSchema from '/imports/api/Games/GamesSchema'

export default class extends React.Component {
  render() {
    return (
      <div>
        <Header as="h1">{'Новая игра'}</Header>
        <AutoForm schema={GamesSchema} onSubmit={doc => console.log(doc)} />
      </div>
    );
  }
}
