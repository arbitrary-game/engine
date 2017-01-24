// it's necessary to support softwarerero/meteor-accounts-t9n to translate Login Form
import ru from '../../i18n/ru.t9n'
import en from '../../i18n/en.t9n'

export default (lang) => {
  // import predefined locales
  T9n.map('ru', ru);
  T9n.map('en', en);

  T9n.setLanguage(lang);
}
