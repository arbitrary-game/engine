import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import i18n from 'meteor/universe:i18n';

import { renderRoutes } from '../imports/ui/Router';
import { getUserLanguage } from '../imports/i18n/i18n';

Meteor.startup(() => {
  const lang = getUserLanguage();
  if (lang){
    var globalMessages = _.clone(SimpleSchema._globalMessages);
    i18n.setLocale(lang).done(()=>{
      console.log('test', i18n.getLocale())
      var lang = i18n.getLocale();
      console.log('lang', lang);
      var localMessages = i18n.__("simpleschema.messages");
      console.log('localMessages', localMessages);
      localMessages.regEx = _.map(localMessages.regEx, function(item) {
          if (item.exp) item.exp = eval(item.exp);
          return item;
      });
      var messages = _.extend(_.clone(globalMessages), localMessages);
      SimpleSchema.messages(messages);
    });
    T9n.setLanguage(lang);
  }
  render(renderRoutes(), document.getElementById('react-root'));
});
