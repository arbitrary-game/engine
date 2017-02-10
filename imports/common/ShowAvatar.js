import {Gravatar} from 'meteor/jparker:gravatar'

export default (user, avatarSize) => {
  if (!avatarSize) avatarSize = 80
  if (user) {
    if (user.profile && user.profile.avatarUrl) {
      return user.profile.avatarUrl
    } else {
      return Gravatar.imageUrl( user.md5hash, { secure: true, size: avatarSize, d: 'wavatar', rating: 'pg' } );
    }
  }
  return "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
}
