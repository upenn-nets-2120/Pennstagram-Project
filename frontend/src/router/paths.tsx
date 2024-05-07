export const HOME_PATH = '/home';
export const FRIENDS_PATH = '/friends';
export const USER_CHATS_PATH = '/chats';
export const CHAT_PATH = '/chat/:chatID';

export type RouterPathsMap = {
    [HOME_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
    [FRIENDS_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
    [USER_CHATS_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
    [CHAT_PATH]: {
        urlParams: { chatID: number };
        queryParams: undefined;
    };
};