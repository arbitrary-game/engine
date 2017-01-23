import {Meteor} from "meteor/meteor";
import React from "react";
import {render} from "react-dom";
import i18n from "meteor/universe:i18n";
import devlogin from "../imports/common/devlogin";
import {renderRoutes} from "../imports/ui/Router";
import {getUserLanguage} from "../imports/i18n/i18n";
// import i18nCheck from './lib/i18nCheck';

Meteor.startup(() => {
  devlogin();
  // i18nCheck();
  const lang = getUserLanguage();
  if (lang) {
    i18n.setLocale(lang);
    T9n.setLanguage(lang);
  }
  render(renderRoutes(), document.getElementById('react-root'));
});
