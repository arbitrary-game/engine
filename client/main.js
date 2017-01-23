import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import devlogin from '../imports/common/devlogin';
// import i18nCheck from './lib/i18nCheck';
//
// i18nCheck();

import { renderRoutes } from '../imports/ui/Router';

Meteor.startup(() => {
  devlogin();
  render(renderRoutes(), document.getElementById('react-root'));
});
