import {Gravatar} from 'meteor/jparker:gravatar'

export default (user, avatarSize) => {
  if (!avatarSize) avatarSize = 80
  if (user) {
    if (user.gravatarExistis){
      return Gravatar.imageUrl( user.md5hash, { secure: true, size: avatarSize, d: 'mm', rating: 'pg' } );
    } else if (user.profile && user.profile.avatarUrl) {
      return user.profile.avatarUrl
    } else {
      return 'http://api.adorable.io/avatars/' + user._id
    }
  }

  return "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
}
