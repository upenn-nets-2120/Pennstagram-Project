import { User } from '../entities/User';

export const getUserActionType = (user: User): 'Request' | 'Following' | 'Follow' | 'Requested' => {
    console.log(user);
    if (user.follows_back) {
        return 'Following';
    } else if (user.requested) {
        return 'Requested';
    } else if (user.userVisibility === 'public') {
        return 'Follow';
    } else {
        return 'Request';
    }
};
