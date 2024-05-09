export const HOME_PATH = '/home';
export const REGISTER_PATH = '/register';
export const LOGIN_PATH = '/login';
export const FRIENDS_PATH = '/friends';
export const CHAT_PATH = '/chat/:chatID?';

export type RouterPathsMap = {
    [HOME_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
    [REGISTER_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
    [LOGIN_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
    [FRIENDS_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
    [CHAT_PATH]: {
        urlParams: { chatID?: number };
        queryParams: undefined;
    };
};