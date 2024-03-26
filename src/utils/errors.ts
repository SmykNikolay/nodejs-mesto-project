export const STATUS_CODES = {
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  CREATED: 201,
  UNAUTHORIZED: 401,
};

export const ERROR_MESSAGES = {
  NOT_FOUND: 'Запрашиваемый ресурс не найден',
  CARD_NOT_FOUND: 'Карточка с указанным _id не найдена.',
  USER_NOT_FOUND: 'Пользователь по указанному _id не найден',
  INTERNAL_SERVER_ERROR: 'На сервере произошла ошибка',
  INVALID_USER_ID: 'Неверный идентификатор пользователя',
  INVALID_USER_DATA: 'Переданы некорректные данные при создании пользователя',
  INVALID_CARD_DATA: 'Переданы некорректные данные при создании карточки',
  INVALID_USER_DATA_UPDATE: 'Переданы некорректные данные при обновлении профиля',
  USER_NOT_AUTHORIZED: 'Пользователь не авторизован',
  INVALID_AVATAR: 'Переданы некорректные данные при обновлении аватара',
  INVALID_ID: 'Передан некорректный идентификатор',
  INVALID_LIKE_DATA: 'Переданы некорректные данные для постановки/снятии лайка.',
  INVALID_CARD_ID: 'Передан несуществующий _id карточки',
};
