import { Message } from "../entities/Message";
import { Chat } from "../entities/Chat";

export const getMessagesFromChat = async (chat: Chat): Promise<Message[]> => {
    const m1 = {
        chatID: 1234,
        name: 'chat one',
        description: 'this is a chat for all the cool people',
        profilePic: '',
        onlyAdmins: false
    }

    const m2 = {
        chatID: 1244,
        name: 'chat one',
        description: 'this is a chat for all the cool people',
        profilePic: '',
        onlyAdmins: false
    }
    const m3 = {
        chatID: 1234,
        name: 'chat one',
        description: 'this is a chat for all the cool people',
        profilePic: '',
        onlyAdmins: false
    }


    return []
};