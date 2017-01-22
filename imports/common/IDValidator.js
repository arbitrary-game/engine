import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export default function() {
  if (this.value.match(SimpleSchema.RegEx.Id)) {
    return true;
  } else if (this.userId === null && this.isInsert && this.docId && !this.docId.match(SimpleSchema.RegEx.Id)) {
    // This is a verbose ID from fixtures
    return true;
  } else {
    return 'expectedId';
  }
}
