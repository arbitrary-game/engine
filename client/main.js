import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import { renderRoutes } from '../imports/api/routes';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('react-root'));
});
