import { User } from "../entities/User";

export const getFriends = async (userID: number): Promise<User[]> => {
    const u1 = {
        userID,
        firstName: 'Sem',
        lastName: 'Ferid',
        profilePic: '',
        relationship: 'Following'
    } as User;

    const u2 = {
        userID,
        firstName: 'Anushka',
        lastName: 'Levaku',
        profilePic: '',
        relationship: 'Following'
    } as User;


    return [u1, u2, u1, u2]
};