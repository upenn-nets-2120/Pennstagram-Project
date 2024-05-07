import { User } from "../entities/User";
import { Chat } from "../entities/Chat";

export const getChatsFromUser = async (user: User): Promise<Chat[]> => {
    const c1 = {
        chatID: 1234,
        name: 'chat one',
        description: 'this is a chat for all the cool people',
        profilePic: '',
        onlyAdmins: false
    }

    const c2 = {
        chatID: 1244,
        name: 'chat one',
        description: 'this is a chat for all the cool people',
        profilePic: '',
        onlyAdmins: false
    }
    
    const c3 = {
        chatID: 1234,
        name: 'chat one',
        description: 'this is a chat for all the cool people',
        profilePic: '',
        onlyAdmins: false
    }


    return [c1, c2, c3, c2, c3, c3, c1]
};