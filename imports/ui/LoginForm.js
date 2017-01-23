import { Accounts, STATES } from 'meteor/std:accounts-ui'
import i18n from 'meteor/universe:i18n';

export default class extends Accounts.ui.LoginForm {
  fields() {
    const { formState } = this.state;
    if (formState == STATES.SIGN_UP) {
      return {
        ...super.fields(),
        name: {
          id: 'name',
          hint: i18n.__('Login.enterName'),
          label: i18n.__('Login.name'),
          onChange: this.handleChange.bind(this, 'name')
        }
      };
    }
    return super.fields();
  }

  signUp(options = {}) {
    const { name = null } = this.state;
    if (name !== null) {
      options.profile = Object.assign(options.profile || {}, {
        name: name
      });
    }
    super.signUp(options);
  }
}
