import React from 'react';
import { Accounts, STATES } from 'meteor/std:accounts-ui'
import { Header } from 'semantic-ui-react'

Accounts.ui.Form = class extends Accounts.ui.Form {
  render() {
    return <div>
      <Header as='h3' textAlign='center'>
        {this.props.formState == STATES.SIGN_IN && T9n.get('loginHeader')}
        {this.props.formState == STATES.SIGN_UP && T9n.get('signupHeader')}
      </Header>
      {super.render()}
    </div>
  }
};

export default class extends Accounts.ui.LoginForm {
  fields() {
    const { formState } = this.state;
    if (formState == STATES.SIGN_UP) {
      return {
        ...super.fields(),
        name: {
          id: 'name',
          hint: T9n.get('enterName'),
          label: T9n.get('name'),
          required: true,
          onChange: this.handleChange.bind(this, 'name'),
          message: this.getMessageForField('name')
        }
      };
    }
    return super.fields();
  }

  signUp(options = {}) {
    const {name} = this.state;
    if (name) {
      options.profile = Object.assign(options.profile || {}, {
        name: name
      });
      super.signUp(options);
    } else {
      this.showMessage(T9n.get('nameRequired'), 'warning', false, 'name')
    }
  }
}
