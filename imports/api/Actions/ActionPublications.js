import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { find, omit, pick } from "lodash";

import Actions from '../Actions/ActionsCollection';
import Games from '../Games/GamesCollection';

const restrictedTypes = ['Stake', 'Vote'];
const isRestrictedAction = action => restrictedTypes.indexOf(action.type) !== -1;
const sanitizeAction = action => omit(action, 'amount', 'candidateId');
const getSanitisedFields = action => pick(action, 'amount', 'candidateId');
const isReadyToPublish = (gameId) => {
  const {expectations} = Games.findOne(gameId).ruleset().getState();
  return expectations.length === 0 || find(expectations, ['type', 'ChooseOpponent']);
};

Meteor.publish('Actions.game', function (gameId) {
  check(gameId, String);
  if (!this.userId) return this.ready();

  const restrictedActions = [];

  const handle = Actions.find({gameId}, {fields: Actions.publicFields}).observeChanges({
    added: (id, action) => {
      if (isRestrictedAction(action)) {
        restrictedActions.push(Object.assign(action, {_id: id}));
        this.added(Actions._name, id, sanitizeAction(action));
      } else {
        this.added(Actions._name, id, action);
      }

      if (isReadyToPublish(gameId)) {
        while (restrictedActions.length) {
          const restricted = restrictedActions.shift();
          this.changed(Actions._name, restricted._id, getSanitisedFields(restricted));
        }
      }
    },
    changed: (id, fields) => {
      this.changed(Actions._name, id, fields);
    },
    removed: (id) => {
      this.removed(Actions._name, id);
    },
  });

  this.onStop(() => handle.stop());

  return this.ready();
});
