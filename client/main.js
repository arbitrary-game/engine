import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import { renderRoutes } from '../imports/ui/Router';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('react-root'));
});
