import { User } from "./User";

export interface Chat {
    chatID: string;
    name: string;
    description: string;
    profilePic: string;
    onlyAdmins?: boolean;
}