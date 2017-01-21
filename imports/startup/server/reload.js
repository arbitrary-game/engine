import _ from 'underscore';
import {statSync, readFileSync} from 'fs';

export default (fixtureManager) => {
  const filename = '/tmp/meteorReloadedCollectionNames';
  try {
    statSync(filename);
  } catch (err) {
    if (err.code === 'ENOENT') { return; }
  }
  const reloadedCollectionNames = _.compact(readFileSync(filename).toString().split('\n'));
  Meteor._debug(`Reloading fixtures for ${reloadedCollectionNames.length ? reloadedCollectionNames.join(', ') : 'all collections'}`);
  fixtureManager.insertAll(reloadedCollectionNames);
}
