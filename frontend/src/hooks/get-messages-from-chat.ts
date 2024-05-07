import { Message } from "../entities/Message";
import { Chat } from "../entities/Chat";
import { User } from "../entities/User";

export const getMessagesFromChat = async (chat: Chat): Promise<Message[]> => {
    const u1 = {
        userID: 1234,
        firstName: 'j',
        lastName: 'crazy',
        profilePic: '',
        relationship: 'Following'
    } as User;

    const u2 = {
        userID: 4321,
        firstName: 'a',
        lastName: 'train',
        profilePic: 'asdf',
        relationship: 'Recommended'
    } as User;

    const c2 = {
        chatID: 1244,
        name: 'chat one',
        description: 'this is a chat for all the cool people',
        profilePic: '',
        onlyAdmins: false
    } as Chat;
    
    const c3 = {
        chatID: 1234,
        name: 'chat one',
        description: 'this is a chat for all the cool people',
        profilePic: '',
        onlyAdmins: false
    } as Chat;

    const m1 = {
        messageID: 1234,
        user: u1,
        chat: c2,
        timestamp: new Date(),
        content: "hi this is a message",
    } as Message;

    const m2 = {
        messageID: 4321,
        user: u2,
        chat: c3,
        timestamp: new Date(),
        content: "I'm responding to you",
    } as Message;

    const m3 = {
        messageID: 1234,
        user: u1,
        chat: c2,
        timestamp: new Date(),
        content: "I'm responding back to your first one bro",
    } as Message;

    return [m1, m2, m3, m1, m2, m3]
};