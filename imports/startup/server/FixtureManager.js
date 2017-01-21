import _ from 'underscore';

export default class FixtureManager {
  constructor() {
    _.defaults(this, {
      buckets: [],
      preHooks: [],
      postHooks: [],
      objectIds: []
    });
  }

  push(collection, objects) {
    let bucket = _.find(this.buckets, (ibucket) => {
      return ibucket.collection === collection;
    });
    if (bucket) {
      _.extend(bucket.objects, objects);
    } else {
      this.buckets.push({
        collection,
        objects
      });
    }
  }

  pre(collection, handler) {
    return this.preHooks.push({
      collection,
      handler
    });
  }

  post(collection, handler) {
    return this.postHooks.push({
      collection,
      handler
    });
  }

  insertAll(reloadedCollectionNames) {
    for (let i = 0; i < this.buckets.length; i++) {
      let bucket = this.buckets[i];
      for (let j = 0; j < this.preHooks.length; j++) {
        let hook = this.preHooks[j];
        if (hook.collection === bucket.collection) {
          hook.handler(bucket.objects, bucket.collection);
        }
      }
      this.insert(bucket.objects, bucket.collection, reloadedCollectionNames);
      for (let j = 0; j < this.postHooks.length; j++) {
        let hook = this.postHooks[j];
        if (hook.collection === bucket.collection) {
          hook.handler(bucket.objects, bucket.collection);
        }
      }
    }
  }

  insert(objects, collection, reloadedCollectionNames) {
    for (let _id in objects) {
      if (objects.hasOwnProperty(_id)) {
        if (this.objectIds.indexOf(_id) < 0) {
          this.objectIds.push(_id);
        }
      }
    }
    if (reloadedCollectionNames.length) {
      if (reloadedCollectionNames.indexOf(collection._name) < 0) {
        return [];
      }
    }
    if (collection.find().count()) {
      return [];
    }
    let ids = [];
    for (let _id in objects) {
      if (objects.hasOwnProperty(_id)) {
        let object = objects[_id];
        object._id = _id;
        ids.push(collection.insert(object));
      }
    }
    return ids;
  }

  ensureAll(collectionNames) {
    for (let i = 0, bucket; i < this.buckets.length; i++) {
      bucket = this.buckets[i];
      this.ensure(bucket.objects, bucket.collection, collectionNames);
    }
  }

  ensure(objects, collection, collectionNames = []) {
    if (collectionNames.indexOf(collection._name) < 0) {
      return false;
    }
    for (let _id in objects) {
      if (objects.hasOwnProperty(_id)) {
        let object = objects[_id];
        if (collection.findOne(_id)) {
          collection.update(_id, {$set: object});
        } else {
          object._id = _id;
          collection.insert(object);
        }
      }
    }
    return true;
  }
};
