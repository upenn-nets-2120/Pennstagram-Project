import { User } from "../entities/User";

export const getFollowed = async (userID: number): Promise<User[]> => {
    const u1 = {
        userID,
        firstName: 'josh',
        lastName: 'weissman',
        profilePic: '',
        relationship: 'Following'
    } as User;

    const u2 = {
        userID,
        firstName: 'alain',
        lastName: 'welliver',
        profilePic: 'asdf',
        relationship: 'Following'
    } as User;


    return [u1, u2, u1, u2]
};