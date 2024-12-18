import { CHAT_CONTAINER_SELECTOR } from './constants'

export const scrollToBottom = () => {
  const chatContainer = document.querySelector(CHAT_CONTAINER_SELECTOR);
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}