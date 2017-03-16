import {Meteor} from "meteor/meteor";
import React from "react";
import {render} from "react-dom";
import i18n from "meteor/universe:i18n";
import devlogin from "../imports/common/devlogin";
import {renderRoutes} from "../imports/ui/Router";
import {getUserLanguage} from "../imports/i18n/i18n";
import enableT9n from "../imports/i18n/t9n";
import "./raven";

import moment from 'moment';
import 'moment/locale/ru';
// import i18nCheck from './lib/i18nCheck';

require('../imports/startup/client');

Meteor.startup(() => {
  devlogin();
  // i18nCheck();
  const lang = getUserLanguage();
  if (lang) {
    var globalMessages = _.clone(SimpleSchema._globalMessages);
    i18n.setLocale(lang, {fresh: Meteor.settings.public.isDebug}).done(() => {
      var lang = i18n.getLocale();
      var localMessages = i18n.__("simpleschema.messages");
      localMessages.regEx = _.map(localMessages.regEx, function(item) {
        if (item.exp) item.exp = eval(item.exp);
        return item;
      });
      var messages = _.extend(_.clone(globalMessages), localMessages);
      SimpleSchema.messages(messages);
    });
    enableT9n(lang);
    moment.locale(lang);
  }
  render(renderRoutes(), document.getElementById('react-root'));
});
