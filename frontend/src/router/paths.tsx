export const HOME_PATH = '/home';
export const REGISTER_PATH = '/register';
export const LOGIN_PATH = '/login';
export const FEED_PATH = '/feed';
export const FRIENDS_PATH = '/friends';
export const CHAT_PATH = '/chat/:chatID?';
export const FORGOT_PATH = '/forgot-password';
export const NEWPASS_PATH = '/new-password';
export const VERIFICATION_PATH = '/verification';
export const NOTIFICATIONS_PATH = '/notifications';
export const PROFILE_PATH = '/profile';
export const SEARCH_PATH = '/search';
export const EDIT_PROFILE_PATH = '/editProfile';

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
    [FEED_PATH]: {
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
    [FORGOT_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
    [NEWPASS_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
    [VERIFICATION_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
    [NOTIFICATIONS_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
    [PROFILE_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
    [SEARCH_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
    [EDIT_PROFILE_PATH]: {
        urlParams: undefined;
        queryParams: undefined;
    };
};