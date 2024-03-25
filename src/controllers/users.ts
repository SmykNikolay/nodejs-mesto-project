import User from '../model/user';

export async function getAllUsers() {
  return User.find({});
}

export async function getUserById(id: string) {
  return User.findById(id);
}

export async function createUser(data: { name: string; about: string; avatar: string }) {
  const user = new User(data);
  await user.save();
  return user;
}

export async function updateUserProfile(userId: string, data: { name: string; about: string; }) {
  return User.findByIdAndUpdate(userId, data, { new: true });
}

export async function updateUserAvatar(userId: string, avatar: string) {
  return User.findByIdAndUpdate(userId, { avatar }, { new: true });
}
