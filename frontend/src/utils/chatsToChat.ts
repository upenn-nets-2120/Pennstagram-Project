import { Chat } from "../entities/Chat";

const findChatById = (chats: Chat[], chatID: string): Chat => {
    const foundChat = chats.find(chat => chat.chatID === chatID);
    return foundChat ? foundChat : chats[0];
};

export default findChatById;
