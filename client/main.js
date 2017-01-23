import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import i18n from 'meteor/universe:i18n';

import { renderRoutes } from '../imports/ui/Router';
import { getUserLanguage } from '../imports/i18n/i18n';

Meteor.startup(() => {
  const lang = getUserLanguage();
  if (lang){
    i18n.setLocale(lang);
    T9n.setLanguage(lang);
  }
  render(renderRoutes(), document.getElementById('react-root'));
});
