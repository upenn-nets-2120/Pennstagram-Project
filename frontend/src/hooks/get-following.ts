import { User } from "../entities/User";

export const getFollowing = async (userID: number): Promise<User[]> => {
    const u1 = {
        userID,
        firstName: 'j',
        lastName: 'crazy',
        profilePic: '',
        relationship: 'Following'
    } as User;

    const u2 = {
        userID,
        firstName: 'a',
        lastName: 'train',
        profilePic: 'asdf',
        relationship: 'Recommended'
    } as User;


    return [u1, u2, u1, u2]
};