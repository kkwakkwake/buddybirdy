export const getSender = (loggedUser, users) => {
  return users && (users[0]?._id === loggedUser?._id) ? users[1].name : users[0].name;
};

export const isSameSender = (messages, current, currentIdx, userId) => {
  return (
    currentIdx < messages.length - 1 &&
    (messages[currentIdx + 1].sender._id !== current.sender._id ||
      messages[currentIdx + 1].sender._id === undefined) && messages[currentIdx].sender._id !== userId
  )
}

export const isLastMessage = (messages, currentIdx, userId) => {
  return (
    currentIdx === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  )
}

export const isSameSenderMargin = (messages, current, currentIdx, userId) => {

  if (
    currentIdx < messages.length - 1 &&
    messages[currentIdx + 1].sender._id === current.sender._id &&
    messages[currentIdx].sender._id !== userId
  )
    return 33;
  else if (
    (currentIdx < messages.length - 1 &&
      messages[currentIdx + 1].sender._id !== current.sender._id &&
      messages[currentIdx].sender._id !== userId) ||
    (currentIdx === messages.length - 1 && messages[currentIdx].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (messages, current, currentIdx) => {
  return currentIdx > 0 && messages[currentIdx - 1].sender._id === current.sender._id
}