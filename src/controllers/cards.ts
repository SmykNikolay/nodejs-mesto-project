import Card from '../model/card';

export async function getAllCards() {
  return Card.find();
}

export async function createCard(data: { name: string; link: string; }) {
  return Card.create(data);
}

export async function deleteCard(cardId: string) {
  return Card.findByIdAndDelete(cardId);
}

export async function likeCard(cardId: string, userId: string) {
  return Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true });
}

export async function dislikeCard(cardId: string, userId: string) {
  return Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true });
}
