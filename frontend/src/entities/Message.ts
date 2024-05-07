import { Chat } from "./Chat";
import { User } from "./User";

export interface Message {
    messageID: number;
    user: User;
    chat: Chat;
    timestamp: Date;
}