export interface Chat {
    chatID: number;
    name: string;
    description: string;
    profilePic: string;
    onlyAdmins?: boolean;
}